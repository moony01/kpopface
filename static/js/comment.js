console.log('댓글 스크립트 로드됨 v7 (반응 시스템)');

/**
 * =========================================================================================
 *  Supabase 클라이언트 설정
 *  - 정적 사이트(Jekyll) 환경에서 .env 사용이 제한되므로, Anon Key를 직접 사용합니다.
 * =========================================================================================
 */
const SUPABASE_URL = "https://eevckvdicfhqxywixznt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVldmNrdmRpY2ZocXh5d2l4em50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NjQwMjQsImV4cCI6MjA4MjQ0MDAyNH0.idh6w8dJ-8Rjdh9aB3DuaYofnO78fNBPuSOG8QoqKqM";

let supabaseClient = null;

function getSupabase() {
    if (supabaseClient) return supabaseClient;
    
    if (window.supabase) {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log('✅ Supabase 클라이언트 초기화 완료');
        } catch (e) {
            console.error('❌ Supabase 클라이언트 초기화 실패:', e);
        }
    } else {
        console.warn('⚠️ window.supabase를 찾을 수 없습니다. CDN 스크립트를 확인하세요.');
    }
    return supabaseClient;
}

const commentListElement = null;
const commentCountElement = null;

/**
 * [Async] 소속사 투표 통계 불러오기
 * - 'kft_vote_counts' 테이블 조회 (Single Row: id=1)
 */
async function fetchVoteCounts() {
    getSupabase();
    if (!supabaseClient) return;

    try {
        const { data, error } = await supabaseClient
            .from('kft_vote_counts')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) throw error;
        if (data) {
            updateVoteUI(data);
        }
    } catch (err) {
        console.error('❌ 투표 통계 불러오기 실패:', err);
    }
}

/**
 * 투표 UI 업데이트
 */
function updateVoteUI(counts) {
    const agencies = ['SM', 'JYP', 'YG']; // 추후 HYBE 등 추가 가능
    
    agencies.forEach(Key => {
        // DB 컬럼은 소문자(sm, jyp, yg), HTML ID는 대문자(cnt-SM)
        const countValue = counts[Key.toLowerCase()] || 0;
        
        // 숫자 애니메이션 적용
        const el = document.getElementById(`cnt-${Key}`);
        if (el) el.innerText = countValue.toLocaleString();
    });
}

/**
 * [Async] 투표 핸들러
 * - 1. 중복 투표 방지 (LocalStorage 체크)
 * - 2. 낙관적 업데이트 (Optimistic UI) - 즉시 반영
 * - 3. 디바운싱 (클릭 방지)
 * - 4. 서버 RPC 호출
 */
async function handleReaction(agency) {
    // 1. 중복 투표 체크
    const hasVoted = localStorage.getItem('kft_voted_' + agency);
    if (hasVoted) {
        alert('이미 투표하셨습니다!');
        return;
    }
    
    // 2. 버튼 비활성화 (일시적)
    const btn = document.querySelector(`.vote-item.vote-${agency.toLowerCase()}`);
    if(btn) btn.style.pointerEvents = 'none';

    // 3. 낙관적 업데이트 (Optimistic UI)
    const countEl = document.getElementById(`cnt-${agency}`);
    let prevCount = 0;
    if (countEl) {
        prevCount = parseInt(countEl.innerText.replace(/,/g, ''), 10) || 0;
        countEl.innerText = (prevCount + 1).toLocaleString();
        
        // 클릭 효과 (Bounce)
        if(btn) {
            btn.classList.add('animate-vote');
            setTimeout(() => btn.classList.remove('animate-vote'), 500);
        }
    }

    getSupabase();
    if (!supabaseClient) {
        if(btn) btn.style.pointerEvents = 'auto';
        return;
    }

    try {
        // 4. 서버 RPC 호출
        const { error } = await supabaseClient.rpc('increment_vote', { agency_key: agency });
        
        if (error) throw error;
        
        // 5. 투표 완료 처리 (LocalStorage 저장)
        localStorage.setItem('kft_voted_' + agency, 'true');
        alert(`${agency}에 한 표를 행사했습니다!`);

    } catch (err) {
        console.error(`${agency} 투표 중 오류:`, err);
        
        // ❌ 실패 시 롤백
        if (countEl) countEl.innerText = prevCount.toLocaleString();
        alert('투표 처리 중 오류가 발생했습니다.');
        
        // LocalStorage에서도 삭제 (다시 시도 가능하게)
        localStorage.removeItem('kft_voted_' + agency);
    } finally {
        // 버튼 다시 활성화
        if(btn) btn.style.pointerEvents = 'auto';
    }
}

/**
 * [Async] 댓글 목록 불러오기
 * - 비밀번호 제외하고 조회
 */
const ITEMS_PER_PAGE = 10;
let currentPage = 1;

/**
 * [Async] 댓글 목록 조회
 * - created_at 내림차순 정렬
 * - 페이징 적용 (10개씩)
 */
async function fetchComments(page = 1) {
    
    // [UI TEST] 더미 데이터 모드
    // 테스트 시 아래 주석을 풀고 return을 활성화하세요.
    /*
    const DUMMY_DATA = [
        { id: 101, nickname: '블랙핑크짱', content: '제 얼굴이 YG상이라니 너무 기뻐요! ㅋㅋㅋ 완전 신기방기\n블랙핑크 제니 느낌 있나요?', created_at: new Date().toISOString(), face_type: 'YG' },
        { id: 102, nickname: 'JYP수장', content: '공기반 소리반 느낌 아시죠? JYP 스타일 확실하네요.\n테스트 결과가 아주 흥미롭습니다.', created_at: new Date(Date.now() - 86400000).toISOString(), face_type: 'JYP' },
        { id: 103, nickname: '광야로걸어', content: '에스파 윈터 닮았다고 나왔어요!! 대박.. \n근데 진짜 닮았나? 주변에 물어봐야겠어요 ㅎㅎ', created_at: new Date(Date.now() - 172800000).toISOString(), face_type: 'SM' },
        { id: 104, nickname: '뉴진스조아', content: '하이브상이라니.. 꿈인가 생시인가 ㅠㅠ \n너무 좋아요! 사이트 디자인도 예쁘네요.', created_at: new Date(Date.now() - 259200000).toISOString(), face_type: 'HYBE' },
        { id: 105, nickname: '지나가던행인', content: '그냥 재미로 해봤는데 은근 정확한듯? 근데 버튼 UI 클릭하면 메뉴 나오는거 맞죠?', created_at: new Date(Date.now() - 345600000).toISOString(), face_type: 'unknown' },
        { id: 106, nickname: '테스트유저6', content: '페이징 테스트용 데이터입니다. 6', created_at: new Date().toISOString(), face_type: 'SM' },
        { id: 107, nickname: '테스트유저7', content: '페이징 테스트용 데이터입니다. 7', created_at: new Date().toISOString(), face_type: 'YG' },
        { id: 108, nickname: '테스트유저8', content: '페이징 테스트용 데이터입니다. 8', created_at: new Date().toISOString(), face_type: 'JYP' },
        { id: 109, nickname: '테스트유저9', content: '페이징 테스트용 데이터입니다. 9', created_at: new Date().toISOString(), face_type: 'HYBE' },
        { id: 110, nickname: '테스트유저10', content: '페이징 테스트용 데이터입니다. 10', created_at: new Date().toISOString(), face_type: 'etc' },
        { id: 111, nickname: '테스트유저11', content: '다음 페이지 데이터 확인용 11', created_at: new Date().toISOString(), face_type: 'SM' }
    ];

    console.log('🧪 [테스트 모드] 더미 데이터 렌더링');
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pagedDummy = DUMMY_DATA.slice(start, end);
    
    renderComments(pagedDummy);
    renderPagination(DUMMY_DATA.length, page);
    return; 
    */

    getSupabase();
    const listEl = document.getElementById('comment-list');
    if (!supabaseClient || !listEl) return;

    try {
        currentPage = page;
        const from = (page - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const { data, error, count } = await supabaseClient
            .from('kft_comments')
            .select('id, created_at, nickname, content, face_type', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        // 전체 댓글 수 업데이트
        const countEl = document.getElementById('comment-count');
        if (countEl) countEl.innerText = count || 0;

        renderComments(data);
        renderPagination(count, page);
        
    } catch (err) {
        console.error('❌ 댓글 불러오기 실패:', err);
    }
}

/**
 * 페이징 UI 렌더링
 */
function renderPagination(totalCount, page) {
    const paginationEl = document.getElementById('pagination-container');
    const numbersEl = document.getElementById('page-numbers');
    const prevBtn = paginationEl.querySelector('.prev');
    const nextBtn = paginationEl.querySelector('.next');

    if (!paginationEl || !numbersEl) return;

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    
    // 페이지가 없거나 1페이지뿐이면 처리
    if (totalPages <= 1) {
        if (totalCount === 0) {
            paginationEl.style.display = 'none';
        } else {
            paginationEl.style.display = 'flex';
            numbersEl.innerHTML = `<button class="page-btn active">1</button>`;
            prevBtn.disabled = true;
            nextBtn.disabled = true;
        }
        return;
    }

    paginationEl.style.display = 'flex';

    // Prev/Next 버튼 상태
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === totalPages;
    
    // 이벤트 리스너 재할당
    prevBtn.onclick = () => fetchComments(page - 1);
    nextBtn.onclick = () => fetchComments(page + 1);

    // 페이지 번호 생성 (최대 5개 표시 알고리즘)
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // 끝쪽 페이지 보정
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    let html = '';
    
    // 첫 페이지로 가는 버튼
    if (startPage > 1) {
        html += `<button class="page-btn" onclick="fetchComments(1)">1</button>`;
        if (startPage > 2) html += `<span class="page-dots">...</span>`;
    }

    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === page ? 'active' : '';
        html += `<button class="page-btn ${isActive}" onclick="fetchComments(${i})">${i}</button>`;
    }

    // 마지막 페이지로 가는 버튼
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) html += `<span class="page-dots">...</span>`;
        html += `<button class="page-btn" onclick="fetchComments(${totalPages})">${totalPages}</button>`;
    }

    numbersEl.innerHTML = html;
}

function renderComments(comments) {
    const listEl = document.getElementById('comment-list');
    const countEl = document.getElementById('comment-count');

    if (countEl) {
        countEl.innerText = comments ? comments.length : 0;
    }

    if (!comments || comments.length === 0) {
        if(listEl) {
            listEl.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">💬</span>
                    <p>아직 댓글이 없습니다.<br>가장 먼저 <strong>분석 결과</strong>를 공유해보세요!</p>
                </div>`;
        }
        return;
    }

    const html = comments.map(comment => {
        const dateObj = new Date(comment.created_at);
        const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;

        let faceBadge = '';
        if (comment.face_type && comment.face_type !== 'unknown') {
            const faceType = comment.face_type;
            let className = 'badge-unknown';
            if (['SM', 'JYP', 'YG', 'HYBE'].includes(faceType)) {
                className = `badge-${faceType.toLowerCase()}`;
            }
            faceBadge = `<span class="face-badge ${className}">${escapeHtml(faceType)} Style</span>`;
        }

        return `
        <div class="comment-item" id="comment-${comment.id}">
            <div class="cmt-top">
                <div class="cmt-info">
                    <span class="cmt-user">${escapeHtml(comment.nickname)}</span>
                    ${faceBadge}
                </div>
                <div class="cmt-right-group">
                    <span class="cmt-date">${dateStr}</span>
                    <div class="more-menu-container">
                        <button class="btn-more" onclick="toggleMenu(${comment.id}, event)" aria-label="댓글 옵션 더보기">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <div id="menu-${comment.id}" class="more-dropdown">
                            <button onclick="handleEdit(${comment.id}, '${escapeHtml(comment.content)}')">
                                <i class="fa-solid fa-pen"></i> 수정
                            </button>
                            <button onclick="handleDelete(${comment.id})">
                                <i class="fa-solid fa-trash"></i> 삭제
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cmt-body">
                <div class="cmt-text">${escapeHtml(comment.content)}</div>
            </div>
        </div>`;
    }).join('');

    if(listEl) listEl.innerHTML = html;
}

/**
 * [Async] 댓글 삭제
 * - 사용자에게 비밀번호 입력 요구 -> RPC 'delete_comment' 호출
 */
async function handleDelete(id) {
    const password = prompt("댓글 작성 시 설정한 비밀번호를 입력해주세요:");
    if (!password) return;

    getSupabase();
    if (!supabaseClient) return;

    try {
        const { data: success, error } = await supabaseClient.rpc('delete_comment', { 
            row_id: id, 
            password_input: password 
        });

        if (error) throw error;

        if (success) {
            alert('삭제되었습니다.');
            fetchComments();
        } else {
            alert('비밀번호가 일치하지 않습니다.');
        }
    } catch (err) {
        console.error('댓글 삭제 오류:', err);
        alert('삭제 중 오류가 발생했습니다.');
    }
}

/**
 * [Async] 댓글 수정
 * - 비밀번호 및 새 내용 입력 요구 -> RPC 'update_comment' 호출
 */
async function handleEdit(id, oldContent) {
    const password = prompt("댓글 수정 권한 확인: 비밀번호를 입력해주세요:");
    if (!password) return;

    const newContent = prompt("수정할 내용을 입력해주세요:", oldContent);
    if (newContent === null) return;
    if (newContent.trim() === "") {
        alert("내용을 입력해주세요.");
        return;
    }

    getSupabase();
    if (!supabaseClient) return;

    try {
        const { data: success, error } = await supabaseClient.rpc('update_comment', {
            row_id: id,
            password_input: password,
            new_content: newContent.trim()
        });

        if (error) throw error;

        if (success) {
            alert('수정되었습니다.');
            fetchComments();
        } else {
            alert('비밀번호가 일치하지 않습니다.');
        }
    } catch (err) {
        console.error('댓글 수정 오류:', err);
        alert('수정 중 오류가 발생했습니다.');
    }
}

/**
 * [Async] 댓글 작성
 */
async function postComment() {
    getSupabase();
    if (!supabaseClient) {
        alert('서비스 초기화 중입니다. 잠시 후 다시 시도해주세요.');
        return;
    }

    const facetype = document.getElementById('cmt-facetype').value;
    const nickname = document.getElementById('cmt-nickname').value.trim();
    const password = document.getElementById('cmt-password').value.trim();
    const content = document.getElementById('cmt-content').value.trim();

    if (!nickname) {
        alert('닉네임을 입력해주세요.');
        document.getElementById('cmt-nickname').focus();
        return;
    }
    if (!password) {
        alert('비밀번호를 입력해주세요.');
        document.getElementById('cmt-password').focus();
        return;
    }
    if (!content) {
        alert('댓글 내용을 입력해주세요.');
        document.getElementById('cmt-content').focus();
        return;
    }
    
    // 500자 제한 유효성 체크
    if (content.length > 500) {
        alert('댓글은 최대 500자까지만 작성 가능합니다.');
        document.getElementById('cmt-content').focus();
        return;
    }

    try {
        const insertPayload = {
            nickname: nickname,
            password: password,
            content: content,
            face_type: facetype
        };

        const { error } = await supabaseClient
            .from('kft_comments')
            .insert([insertPayload]);

        if (error) throw error;

        document.getElementById('cmt-nickname').value = '';
        document.getElementById('cmt-password').value = '';
        document.getElementById('cmt-content').value = '';
        document.getElementById('cmt-facetype').value = 'unknown';

        alert('댓글이 등록되었습니다!');
        fetchComments();

    } catch (err) {
        console.error('댓글 등록 실패:', err);
        alert('댓글 등록에 실패했습니다.');
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * 더보기 메뉴 토글
 */
function toggleMenu(id, event) {
    event.stopPropagation(); // 버튼 클릭 시 이벤트 전파 방지
    const menu = document.getElementById(`menu-${id}`);
    
    // 다른 열린 메뉴들 닫기
    document.querySelectorAll('.more-dropdown').forEach(el => {
        if (el.id !== `menu-${id}`) {
            el.classList.remove('show');
        }
    });

    if (menu) {
        menu.classList.toggle('show');
    }
}

// 외부 클릭 시 모든 메뉴 닫기
document.addEventListener('click', (e) => {
    if (!e.target.closest('.more-menu-container')) {
        document.querySelectorAll('.more-dropdown').forEach(el => {
            el.classList.remove('show');
        });
    }
});

window.toggleMenu = toggleMenu;
window.postComment = postComment;
window.fetchComments = fetchComments;
window.handleReaction = handleReaction;
window.handleEdit = handleEdit;
window.handleDelete = handleDelete;

/**
 * 페이지 로드 초기화
 */
function loadInitialData() {
    console.log('🔄 초기 데이터 로딩...');
    
    // 댓글 섹션 로드
    if (document.getElementById('comment-list')) {
        fetchComments();
    }

    // 투표 섹션 로드
    if (document.getElementById('vote-container')) {
        console.log('투표 섹션 발견, 통계 로딩...');
        fetchVoteCounts();
        
        // 내 투표 이력 체크
        ['SM', 'JYP', 'YG'].forEach(agency => {
            if (localStorage.getItem('kft_voted_' + agency)) {
                // 이미 투표했다면 스타일 변경 등 처리 가능
            }
        });
    }
}

// DOMContentLoaded 이벤트 리스너
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadInitialData);
} else {
    // 이미 로드된 경우 즉시 실행
    loadInitialData();
}

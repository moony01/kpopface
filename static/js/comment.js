console.log('Comment script loaded v5');

/**
 * =========================================================================================
 *  Supabase 클라이언트 설정 (Supabase Client Configuration)
 *  - 정적 사이트(Jekyll) 환경에서 .env 사용이 제한되므로, Anon Key를 직접 사용합니다.
 *  - SUPABASE_KEY는 public(anon) 키이므로 클라이언트 코드에 노출되어도 안전합니다.
 * =========================================================================================
 */
const SUPABASE_URL = "https://eevckvdicfhqxywixznt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVldmNrdmRpY2ZocXh5d2l4em50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NjQwMjQsImV4cCI6MjA4MjQ0MDAyNH0.idh6w8dJ-8Rjdh9aB3DuaYofnO78fNBPuSOG8QoqKqM";

/**
 * 전역 Supabase 클라이언트 인스턴스 (Global Supabase Client Instance)
 * - getSupabase() 함수를 통해 지연 초기화(Lazy Initialization)됩니다.
 */
let supabaseClient = null;

/**
 * Supabase 클라이언트 인스턴스 반환 함수 (Singleton Pattern)
 * - window.supabase 객체(CDN)가 로드된 후에만 클라이언트를 생성합니다.
 * - 이미 생성된 경우 기존 인스턴스를 반환하여 중복 생성을 방지합니다.
 * @returns {object|null} 초기화된 Supabase 클라이언트 또는 null
 */
function getSupabase() {
    if (supabaseClient) return supabaseClient;
    
    if (window.supabase) {
        try {
            // URL 및 Key 공백 제거 등 안전 장치 추가 가능하나, 상단 상수 선언부에서 처리함
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log('✅ Supabase client initialized successfully.');
        } catch (e) {
            console.error('❌ Failed to initialize Supabase client:', e);
        }
    } else {
        console.warn('⚠️ window.supabase is not available. Check CDN script.');
    }
    return supabaseClient;
}

/**
 * 전역 변수 선언 (Global DOM Elements)
 */
const commentListElement = document.getElementById('comment-list');
const commentCountElement = document.getElementById('comment-count');

/**
 * [Async] 댓글 목록 불러오기 (Fetch and Display Comments)
 * - 'kft_comments' 테이블에서 최신순으로 댓글을 조회합니다.
 */
async function fetchComments() {
    getSupabase(); // 클라이언트 초기화 확인
    if (!supabaseClient || !commentListElement) return;

    try {
        const { data, error } = await supabaseClient
            .from('kft_comments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        renderComments(data);
    } catch (err) {
        console.error('❌ Error fetching comments:', err);
    }
}

/**
 * 댓글 목록 DOM 렌더링 (Render Comments)
 * @param {Array} comments 댓글 데이터 배열
 */
function renderComments(comments) {
    // 댓글 총 개수 업데이트
    if (commentCountElement) {
        commentCountElement.innerText = comments ? comments.length : 0;
    }

    // 댓글이 없는 경우 처리
    if (!comments || comments.length === 0) {
        commentListElement.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">💬</span>
                <p>아직 댓글이 없습니다.<br>가장 먼저 <strong>분석 결과</strong>를 공유해보세요!</p>
            </div>`;
        return;
    }

    // HTML 생성
    const html = comments.map(comment => {
        // 날짜 포맷팅: YYYY.MM.DD
        const dateObj = new Date(comment.created_at);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const dateStr = `${year}.${month}.${day}`;

        // 얼굴상 뱃지 로직 (Face Badge Logic)
        let faceBadge = '';
        if (comment.face_type && comment.face_type !== 'unknown') {
            const faceType = comment.face_type; // SM, JYP, YG, HYBE 등
            let className = 'badge-unknown';
            // CSS 클래스 매핑
            if (['SM', 'JYP', 'YG', 'HYBE'].includes(faceType)) {
                className = `badge-${faceType.toLowerCase()}`;
            }
            faceBadge = `<span class="face-badge ${className}">${faceType} Style</span>`;
        }

        return `
        <div class="comment-item">
            <div class="cmt-meta">
                <span class="cmt-user">
                    ${escapeHtml(comment.nickname)} ${faceBadge}
                </span>
                <span class="cmt-date">${dateStr}</span>
            </div>
            <div class="cmt-content">${escapeHtml(comment.content)}</div>
        </div>`;
    }).join('');

    commentListElement.innerHTML = html;
}

/**
 * [Async] 댓글 작성 (Post a New Comment)
 * - 입력값 유효성을 검사하고 Supabase에 데이터를 저장합니다.
 */
async function postComment() {
    getSupabase();
    if (!supabaseClient) {
        alert('서비스를 사용할 수 없습니다 (Supabase 초기화 실패).\n콘솔 로그를 확인해주세요.');
        return;
    }

    // DOM 요소 가져오기
    const facetype = document.getElementById('cmt-facetype').value;
    const nickname = document.getElementById('cmt-nickname').value.trim();
    const password = document.getElementById('cmt-password').value.trim();
    const content = document.getElementById('cmt-content').value.trim();

    // 입력값 유효성 검사 (Validation)
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

    try {
        const insertPayload = {
            nickname: nickname,
            password: password,
            content: content,
            face_type: facetype
        };

        const { data, error } = await supabaseClient
            .from('kft_comments')
            .insert([insertPayload])
            .select();

        if (error) throw error;

        // 폼 초기화 (Reset Form)
        document.getElementById('cmt-nickname').value = '';
        document.getElementById('cmt-password').value = '';
        document.getElementById('cmt-content').value = '';
        // facetype은 보통 유지하거나 'unknown'으로 되돌림 (여기서는 'unknown')
        document.getElementById('cmt-facetype').value = 'unknown';

        alert('댓글이 성공적으로 등록되었습니다!');
        fetchComments(); // 목록 새로고침

    } catch (err) {
        console.error('❌ Error posting comment:', err);
        alert('댓글 등록에 실패했습니다. 다시 시도해주세요.');
    }
}

/**
 * HTML 이스케이프 헬퍼 함수 (XSS 방지)
 * @param {string} text - 이스케이프할 텍스트
 * @returns {string} 이스케이프된 텍스트
 */
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
 * 전역 스코프 노출 (Expose to Global Scope)
 * - HTML의 onclick 속성 등에서 접근할 수 있도록 설정합니다.
 */
window.postComment = postComment;
window.fetchComments = fetchComments;

/**
 * 페이지 로드 초기화 (Initial Load)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 댓글 섹션이 있는 페이지인 경우에만 댓글 목록 로드
    if (document.getElementById('comment-list')) {
        fetchComments();
    }
});

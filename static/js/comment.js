console.log('Comment script loaded v5');
// Supabase Client Configuration
const SUPABASE_URL = "https://eevckvdicfhqxywixznt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVldmNrdmRpY2ZocXh5d2l4em50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NjQwMjQsImV4cCI6MjA4MjQ0MDAyNH0.idh6w8dJ-8Rjdh9aB3DuaYofnO78fNBPuSOG8QoqKqM";

// Debug URL Validity explicitly
try {
    new URL(SUPABASE_URL);
    console.log("Supabase URL is valid:", SUPABASE_URL);
} catch (e) {
    console.error("Supabase URL invalid!", e);
    for (let i = 0; i < SUPABASE_URL.length; i++) {
        console.log(`Char ${i}: ${SUPABASE_URL[i]} (${SUPABASE_URL.charCodeAt(i)})`);
    }
}

// Initialize Supabase Client
// Ensure window.supabase exists (loaded via CDN)
// Initialize Supabase Client
let supabaseClient = null;

function getSupabase() {
    if (supabaseClient) return supabaseClient;
    
    if (window.supabase) {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log('Supabase client initialized successfully.');
        } catch (e) {
            console.error('Failed to initialize Supabase client:', e);
        }
    } else {
        console.warn('window.supabase is not available. Check CDN script.');
    }
    return supabaseClient;
}

// Initial check (optional, just for log)
document.addEventListener('DOMContentLoaded', () => {
   if (!window.supabase) console.warn('Supabase JS not loaded on DOMContentLoaded');
});

// Global variables
const commentListElement = document.getElementById('comment-list');
const commentCountElement = document.getElementById('comment-count');

/**
 * Fetch and display comments
 */
async function fetchComments() {
    getSupabase();
    if (!supabaseClient || !commentListElement) return;

    try {
        const { data, error } = await supabaseClient
            .from('kft_comments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        renderComments(data);
    } catch (err) {
        console.error('Error fetching comments:', err);
    }
}

/**
 * Render comments to DOM
 */
function renderComments(comments) {
    if (commentCountElement) {
        commentCountElement.innerText = comments ? comments.length : 0;
    }

    if (!comments || comments.length === 0) {
        commentListElement.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">💬</span>
                <p>No comments yet.<br>Be the first to share your <strong>analysis result</strong>!</p>
            </div>`;
        return;
    }

    const html = comments.map(comment => {
        // Date formatting: YYYY-MM-DD
        const dateObj = new Date(comment.created_at);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const dateStr = `${year}.${month}.${day}`;

        // Face Badge Logic
        let faceBadge = '';
        if (comment.face_type && comment.face_type !== 'unknown') {
            const faceType = comment.face_type; // SM, JYP, YG, HYBE, etc
            let className = 'badge-unknown';
            // map common types to css classes
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
 * Post a new comment
 */
async function postComment() {
    getSupabase();
    if (!supabaseClient) {
        alert('Service is unavailable (Supabase Client failed to init). See console for details.');
        return;
    }

    const facetype = document.getElementById('cmt-facetype').value;
    const nickname = document.getElementById('cmt-nickname').value.trim();
    const password = document.getElementById('cmt-password').value.trim();
    const content = document.getElementById('cmt-content').value.trim();

    // Validation
    if (!nickname) {
        alert('Please enter your Nickname.');
        document.getElementById('cmt-nickname').focus();
        return;
    }
    if (!password) {
        alert('Please enter a Password.');
        document.getElementById('cmt-password').focus();
        return;
    }
    if (!content) {
        alert('Please enter your Comment.');
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

        // Reset Form
        document.getElementById('cmt-nickname').value = '';
        document.getElementById('cmt-password').value = '';
        document.getElementById('cmt-content').value = '';
        document.getElementById('cmt-facetype').value = 'unknown';

        alert('Comment submitted successfully!');
        fetchComments(); // Reload list

    } catch (err) {
        console.error('Error posting comment:', err);
        alert('Failed to submit comment. Please try again.');
    }
}

/**
 * HTML Escape helper
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

// Make functions available globally for HTML onclick attributes
window.postComment = postComment;
window.fetchComments = fetchComments;

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the page with comments
    if (document.getElementById('comment-list')) {
        fetchComments();
    }
});

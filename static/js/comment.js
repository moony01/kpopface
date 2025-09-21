// API Gateway로 노출된 Lambda 엔드포인트
// const API_URL = "https://<api-id>.execute-api.<region>.amazonaws.com/prod";
const API_URL = "https://kl3qt2albv3s5hxdk3pangtbrm0mgaza.lambda-url.ap-northeast-2.on.aws";

async function loadComments() {
  const res = await fetch(`${API_URL}/comments?postId=kpopface`);
  const data = await res.json();
  const wrap = document.getElementById("comments");
  wrap.innerHTML = data
    .map(c => `<p><strong>${c.nickname}</strong> ${c.content}</p>`)
    .join("");
}

async function submitComment(e) {
  e.preventDefault();
  const payload = {
    postId: "kpopface",
    nickname: document.getElementById("nickname").value,
    content: document.getElementById("content").value
  };
  await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  e.target.reset();
  loadComments();
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("comment-form");
  if (form) {
    form.addEventListener("submit", submitComment);
  }
  loadComments();
});
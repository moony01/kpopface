/**
 * 분석 로딩 페이지 전용 로직
 * 5초 동안 프로그레스 바 애니메이션 + 팁 표시
 */
(function() {
  var progress = 0;
  var resultId = new URLSearchParams(window.location.search).get('id');

  var steps = [
    "얼굴형 분석 중...",
    "눈매 특징 추출 중...",
    "이목구비 비율 계산 중...",
    "소속사 스타일 매칭 중...",
    "최종 결과 생성 중..."
  ];

  var tips = [
    "SM은 시원한 눈매와 차가운 이미지를 선호합니다",
    "JYP는 친근하고 건강한 이미지를 중시합니다",
    "YG는 개성 있는 독특한 매력을 추구합니다",
    "SM 아이돌들은 '아이컨택'이 강점입니다",
    "JYP는 '눈웃음'을 중요하게 생각합니다",
    "YG는 자신만의 스타일이 확실한 사람을 선호합니다"
  ];

  // 결과 ID 없으면 메인으로 리다이렉트
  if (!resultId) {
    var langPath = PageRouter ? PageRouter.getLangPath() : '';
    var basePath = langPath ? '/kpopface/' + langPath + '/' : '/kpopface/';
    window.location.href = basePath;
    return;
  }

  // 결과 데이터 로드하여 사용자 이미지 표시
  var result = PageRouter ? PageRouter.loadResult() : null;
  if (result && result.image) {
    var userImageEl = document.getElementById('user-image');
    if (userImageEl) {
      userImageEl.src = result.image;
    }
  }

  // 랜덤 팁 표시
  var tipEl = document.getElementById('tip-text');
  if (tipEl) {
    tipEl.textContent = tips[Math.floor(Math.random() * tips.length)];
  }

  // 프로그레스 애니메이션
  var interval = setInterval(function() {
    progress += 2;

    // UI 업데이트
    var progressBar = document.getElementById('progress-bar');
    var progressText = document.getElementById('progress-text');
    var stepText = document.getElementById('step-text');

    if (progressBar) progressBar.style.width = progress + '%';
    if (progressText) progressText.textContent = progress + '%';

    var stepIndex = Math.min(Math.floor(progress / 20), steps.length - 1);
    if (stepText) stepText.textContent = steps[stepIndex];

    // 완료 시 결과 페이지로 이동
    if (progress >= 100) {
      clearInterval(interval);

      var langPath = PageRouter ? PageRouter.getLangPath() : '';
      var basePath = langPath ? '/kpopface/' + langPath + '/' : '/kpopface/';
      window.location.href = basePath + 'result.html?id=' + resultId;
    }
  }, 100); // 5초 동안 진행 (100ms × 50회)
})();

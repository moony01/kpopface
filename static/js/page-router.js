/**
 * 페이지 라우터 모듈
 * 페이지 분리 수익화 전략을 위한 페이지 간 데이터 전달 모듈
 */
var PageRouter = (function() {
  var STORAGE_PREFIX = 'kpopface_result_';

  /**
   * 결과 데이터 저장 및 다음 페이지로 이동
   * @param {Object} resultData - 분석 결과 데이터
   * @param {string} targetPage - 이동할 페이지 (analyzing, result, detail)
   */
  function saveAndNavigate(resultData, targetPage) {
    var resultId = Date.now().toString();
    resultData.id = resultId;
    resultData.timestamp = Date.now();

    sessionStorage.setItem(STORAGE_PREFIX + resultId, JSON.stringify(resultData));

    // 언어별 경로 처리 (kpopface 베이스 경로 포함)
    var langPath = getLangPath();
    var basePath = langPath ? '/kpopface/' + langPath + '/' : '/kpopface/';

    window.location.href = basePath + targetPage + '.html?id=' + resultId;
  }

  /**
   * 현재 페이지의 결과 데이터 로드
   * @returns {Object|null} 결과 데이터 또는 null
   */
  function loadResult() {
    var resultId = getResultId();
    if (!resultId) return null;

    var data = sessionStorage.getItem(STORAGE_PREFIX + resultId);
    return data ? JSON.parse(data) : null;
  }

  /**
   * URL에서 결과 ID 추출
   * @returns {string|null} 결과 ID
   */
  function getResultId() {
    return new URLSearchParams(window.location.search).get('id');
  }

  /**
   * 현재 언어 경로 추출
   * @returns {string} 언어 코드 (ko의 경우 빈 문자열)
   */
  function getLangPath() {
    var pathParts = window.location.pathname.split('/');
    // /kpopface/en/analyzing.html -> en
    // /kpopface/analyzing.html -> ''
    var langIndex = pathParts.indexOf('kpopface') + 1;
    var possibleLang = pathParts[langIndex];

    var supportedLangs = ['en', 'de', 'es', 'fr', 'id', 'ja', 'nl', 'pl', 'pt', 'ru', 'tr', 'uk', 'vi', 'zh'];

    if (supportedLangs.indexOf(possibleLang) !== -1) {
      return possibleLang;
    }
    return '';
  }

  /**
   * 결과가 없으면 메인으로 리다이렉트
   * @returns {Object|null} 결과 데이터 또는 null (리다이렉트 시)
   */
  function requireResult() {
    var result = loadResult();
    if (!result) {
      var langPath = getLangPath();
      var basePath = langPath ? '/kpopface/' + langPath + '/' : '/kpopface/';
      window.location.href = basePath;
      return null;
    }
    return result;
  }

  /**
   * 결과 데이터 업데이트
   * @param {Object} updates - 업데이트할 데이터
   */
  function updateResult(updates) {
    var result = loadResult();
    if (!result) return;

    for (var key in updates) {
      if (updates.hasOwnProperty(key)) {
        result[key] = updates[key];
      }
    }

    sessionStorage.setItem(STORAGE_PREFIX + result.id, JSON.stringify(result));
  }

  /**
   * 다음 페이지로 이동 (기존 결과 ID 유지)
   * @param {string} targetPage - 이동할 페이지
   */
  function navigateTo(targetPage) {
    var resultId = getResultId();
    var langPath = getLangPath();
    var basePath = langPath ? '/kpopface/' + langPath + '/' : '/kpopface/';

    window.location.href = basePath + targetPage + '.html?id=' + resultId;
  }

  // Public API
  return {
    saveAndNavigate: saveAndNavigate,
    loadResult: loadResult,
    getResultId: getResultId,
    getLangPath: getLangPath,
    requireResult: requireResult,
    updateResult: updateResult,
    navigateTo: navigateTo
  };
})();

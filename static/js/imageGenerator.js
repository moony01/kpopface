/**
 * K-Pop Face Test - Canvas API 결과 이미지 생성기
 * 
 * @file imageGenerator.js
 * @description Canvas API로 K-POP Face Test 결과 이미지를 생성
 * @version 1.0.0
 */

(function(global) {
  'use strict';

  // ============================================
  // 상수 정의
  // ============================================
  
  var CANVAS_WIDTH = 1080;
  var CANVAS_HEIGHT = 1920;
  var SITE_URL = 'moony01.com/kpopface';
  
  // 소속사별 테마 색상
  var AGENCY_COLORS = {
    sm: { main: '#0066FF', sub: '#00D4FF' },   // 파랑
    jyp: { main: '#00C853', sub: '#69F0AE' },  // 초록
    yg: { main: '#212121', sub: '#616161' },   // 블랙
    hybe: { main: '#6B46C1', sub: '#EC4899' }  // 보라-핑크
  };
  
  // 소속사별 이모지
  var AGENCY_EMOJI = {
    sm: '\uD83D\uDC99',    // 💙
    jyp: '\uD83D\uDC9A',   // 💚
    yg: '\uD83D\uDDA4',    // 🖤
    hybe: '\uD83D\uDC9C'   // 💜
  };
  
  // 다국어 CTA 텍스트
  var CTA_TEXTS = {
    ko: '\uB098\uB3C4 \uD14C\uC2A4\uD2B8 \uD558\uAE30!',  // 나도 테스트 하기!
    en: 'Try the test!',
    ja: '\u30C6\u30B9\u30C8\u3057\u3066\u307F\u308B\uFF01',  // テストしてみる！
    zh: '\u6211\u4E5F\u8981\u6D4B\u8BD5\uFF01',  // 我也要测试！
    default: 'Try the test!'
  };

  // ============================================
  // 헬퍼 함수
  // ============================================
  
  /**
   * 소속사별 색상 반환
   * @param {string} agency - 소속사 코드 (sm, jyp, yg, hybe)
   * @returns {Object} { main: string, sub: string }
   */
  function getAgencyColors(agency) {
    var key = (agency || '').toLowerCase();
    return AGENCY_COLORS[key] || AGENCY_COLORS.hybe;
  }
  
  /**
   * 소속사별 이모지 반환
   * @param {string} agency - 소속사 코드
   * @returns {string} 이모지 문자
   */
  function getAgencyEmoji(agency) {
    var key = (agency || '').toLowerCase();
    return AGENCY_EMOJI[key] || '\uD83C\uDFA4';  // 🎤 (기본값)
  }
  
  /**
   * 언어별 CTA 텍스트 반환
   * @param {string} lang - 언어 코드
   * @returns {string} CTA 텍스트
   */
  function getCTAText(lang) {
    var key = (lang || 'ko').toLowerCase();
    return CTA_TEXTS[key] || CTA_TEXTS.default;
  }
  
  /**
   * 이미지 로드 헬퍼 (Promise 기반)
   * @param {string} url - 이미지 URL
   * @returns {Promise<HTMLImageElement>}
   */
  function loadImage(url) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function() { resolve(img); };
      img.onerror = function(e) { reject(e); };
      img.src = url;
    });
  }
  
  /**
   * 텍스트 자동 줄바꿈
   * @param {CanvasRenderingContext2D} ctx - Canvas 컨텍스트
   * @param {string} text - 텍스트
   * @param {number} x - X 좌표 (중앙 정렬 기준)
   * @param {number} y - Y 좌표 (시작점)
   * @param {number} maxWidth - 최대 너비
   * @param {number} lineHeight - 줄 높이
   * @returns {number} 렌더링된 총 높이
   */
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return 0;
    
    // 공백과 한글/CJK 문자 기준으로 분리
    var words = text.split(/(\s+)/);
    var line = '';
    var currentY = y;
    var totalHeight = 0;
    
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var testLine = line + word;
      var metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line.trim(), x, currentY);
        line = word;
        currentY += lineHeight;
        totalHeight += lineHeight;
      } else {
        line = testLine;
      }
    }
    
    // 마지막 줄 렌더링
    if (line.trim()) {
      ctx.fillText(line.trim(), x, currentY);
      totalHeight += lineHeight;
    }
    
    return totalHeight;
  }
  
  /**
   * 텍스트 길이 제한 (말줄임)
   * @param {string} text - 원본 텍스트
   * @param {number} maxLength - 최대 길이
   * @returns {string} 잘린 텍스트
   */
  function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // ============================================
  // 메인 이미지 생성 함수
  // ============================================
  
  /**
   * Canvas API로 K-Pop Face Test 결과 이미지 생성
   * 
   * @param {Object} data - 결과 데이터
   * @param {string} data.agency - 소속사 코드 (sm, jyp, yg, hybe)
   * @param {string} data.title - 결과 제목 (예: "SM얼굴상")
   * @param {string} data.explain - 해시태그 설명
   * @param {string} data.celeb - 대표 연예인
   * @param {string} data.lang - 언어 코드 (ko, en, ja, zh 등)
   * @returns {Promise<Blob>} PNG 이미지 Blob
   */
  function generateResultImage(data) {
    var agency = data.agency || 'hybe';
    var title = data.title || '';
    var explain = data.explain || '';
    var celeb = data.celeb || '';
    var lang = data.lang || 'ko';
    
    // 폰트 로드 대기
    var fontReady = (document.fonts && document.fonts.ready) 
      ? document.fonts.ready 
      : Promise.resolve();
    
    return fontReady.then(function() {
      // 1. Canvas 생성 (인스타 스토리 비율 9:16)
      var canvas = document.createElement('canvas');
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      var ctx = canvas.getContext('2d');
      
      // 2. 소속사별 배경 그라데이션
      var colors = getAgencyColors(agency);
      var gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, colors.main);
      gradient.addColorStop(1, colors.sub);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // 3. 반투명 오버레이 (가독성 향상)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // 4. 상단 타이틀
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 55px Pretendard, "Noto Sans KR", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('K-POP Face Test', CANVAS_WIDTH / 2, 150);
      
      // 5. 상단 URL
      ctx.font = '32px Pretendard, "Noto Sans KR", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText(SITE_URL, CANVAS_WIDTH / 2, 210);
      
      // 6. 구분선
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(200, 280);
      ctx.lineTo(CANVAS_WIDTH - 200, 280);
      ctx.stroke();
      
      // 7. 소속사 이모지 (크게)
      ctx.font = '200px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(getAgencyEmoji(agency), CANVAS_WIDTH / 2, 500);
      
      // 8. 결과 제목
      ctx.font = 'bold 90px Pretendard, "Noto Sans KR", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(title, CANVAS_WIDTH / 2, 750);
      
      // 그림자 초기화
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // 9. 해시태그/설명
      ctx.font = '42px Pretendard, "Noto Sans KR", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      wrapText(ctx, explain, CANVAS_WIDTH / 2, 880, 900, 60);
      
      // 10. 대표 연예인 (축약)
      var shortCeleb = truncateText(celeb, 60);
      ctx.font = '36px Pretendard, "Noto Sans KR", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      wrapText(ctx, shortCeleb, CANVAS_WIDTH / 2, 1150, 900, 50);
      
      // 11. 하단 CTA 배경
      ctx.fillStyle = 'rgba(255, 237, 78, 0.95)';  // 노란색
      roundRect(ctx, 240, 1550, 600, 100, 50);
      ctx.fill();
      
      // 12. 하단 CTA 텍스트
      ctx.font = 'bold 45px Pretendard, "Noto Sans KR", sans-serif';
      ctx.fillStyle = '#1A1A1A';
      ctx.fillText(getCTAText(lang), CANVAS_WIDTH / 2, 1605);
      
      // 13. URL 워터마크
      ctx.font = '38px Pretendard, "Noto Sans KR", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(SITE_URL, CANVAS_WIDTH / 2, 1750);
      
      // 14. 하단 장식선
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(350, 1820);
      ctx.lineTo(CANVAS_WIDTH - 350, 1820);
      ctx.stroke();
      
      // 15. PNG Blob 반환
      return new Promise(function(resolve, reject) {
        try {
          canvas.toBlob(function(blob) {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas toBlob failed'));
            }
          }, 'image/png', 1.0);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
  
  /**
   * 둥근 모서리 사각형 그리기
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number} radius
   */
  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // ============================================
  // 전역 노출
  // ============================================
  
  // 메인 함수
  global.generateResultImage = generateResultImage;
  
  // 헬퍼 함수 (테스트/디버깅용)
  global.imageGeneratorUtils = {
    getAgencyColors: getAgencyColors,
    getAgencyEmoji: getAgencyEmoji,
    getCTAText: getCTAText,
    wrapText: wrapText,
    truncateText: truncateText,
    loadImage: loadImage
  };
  
  // 버전 정보
  global.imageGeneratorVersion = '1.0.0';

})(typeof window !== 'undefined' ? window : this);

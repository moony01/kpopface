/**
 * K-Pop Face Test - Canvas API 결과 이미지 생성기
 * 
 * @file imageGenerator.js
 * @description Canvas API로 K-POP Face Test 결과 이미지를 생성 (사용자 사진 포함)
 * @version 2.0.0
 * @update T1.9 - 사용자 업로드 이미지 포함 기능 추가
 */

(function(global) {
  'use strict';

  // ============================================
  // 상수 정의
  // ============================================
  
  var CANVAS_WIDTH = 1080;
  var CANVAS_HEIGHT = 1920;
  var SITE_URL = 'moony01.com/kpopface';
  
  // 사용자 이미지 설정
  var USER_IMAGE_SIZE = 420;       // 사용자 이미지 크기 (정사각형)
  var USER_IMAGE_BORDER = 12;      // 테두리 두께
  var USER_IMAGE_Y = 320;          // 이미지 Y 좌표
  
  // 소속사별 테마 색상
  var AGENCY_COLORS = {
    sm: { main: '#0066FF', sub: '#00D4FF', border: '#00AAFF' },   // 파랑
    jyp: { main: '#00C853', sub: '#69F0AE', border: '#00E676' },  // 초록
    yg: { main: '#212121', sub: '#616161', border: '#424242' },   // 블랙
    hybe: { main: '#6B46C1', sub: '#EC4899', border: '#9333EA' }  // 보라-핑크
  };
  
  // 소속사별 이모지 (fallback용)
  var AGENCY_EMOJI = {
    sm: '\uD83D\uDC99',    // 💙
    jyp: '\uD83D\uDC9A',   // 💚
    yg: '\uD83D\uDDA4',    // 🖤
    hybe: '\uD83D\uDC9C'   // 💜
  };
  
  // 다국어 CTA 텍스트 (15개 언어 지원)
  var CTA_TEXTS = {
    ko: '\uB098\uB3C4 \uD14C\uC2A4\uD2B8 \uD558\uAE30!',  // 나도 테스트 하기!
    en: 'Try the test!',
    ja: '\u30C6\u30B9\u30C8\u3057\u3066\u307F\u308B\uFF01',  // テストしてみる！
    zh: '\u6211\u4E5F\u8981\u6D4B\u8BD5\uFF01',  // 我也要测试！
    de: 'Mach den Test!',           // 독일어
    es: '\u00A1Haz el test!',       // 스페인어 (¡Haz el test!)
    fr: 'Fais le test !',           // 프랑스어
    id: 'Coba tesnya!',             // 인도네시아어
    nl: 'Doe de test!',             // 네덜란드어
    pl: 'Zr\u00F3b test!',          // 폴란드어 (Zrób test!)
    pt: 'Fa\u00E7a o teste!',       // 포르투갈어 (Faça o teste!)
    ru: '\u041F\u0440\u043E\u0439\u0434\u0438 \u0442\u0435\u0441\u0442!',  // 러시아어 (Пройди тест!)
    tr: 'Testi yap!',               // 터키어
    uk: '\u041F\u0440\u043E\u0439\u0434\u0438 \u0442\u0435\u0441\u0442!',  // 우크라이나어 (Пройди тест!)
    vi: 'L\u00E0m b\u00E0i test!',  // 베트남어 (Làm bài test!)
    default: 'Try the test!'
  };

  // ============================================
  // 헬퍼 함수
  // ============================================
  
  /**
   * 소속사별 색상 반환
   * @param {string} agency - 소속사 코드 (sm, jyp, yg, hybe)
   * @returns {Object} { main: string, sub: string, border: string }
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
   * @param {string} url - 이미지 URL (base64 data URL 포함)
   * @returns {Promise<HTMLImageElement>}
   */
  function loadImage(url) {
    return new Promise(function(resolve, reject) {
      if (!url) {
        reject(new Error('Image URL is empty'));
        return;
      }
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
  
  /**
   * 원형 클리핑으로 이미지 그리기
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLImageElement} img - 이미지 객체
   * @param {number} x - 중심 X
   * @param {number} y - 중심 Y
   * @param {number} size - 원 지름
   * @param {string} borderColor - 테두리 색상
   * @param {number} borderWidth - 테두리 두께
   */
  function drawCircularImage(ctx, img, x, y, size, borderColor, borderWidth) {
    var radius = size / 2;
    
    // 테두리 그리기 (그림자 효과 포함)
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 8;
    
    ctx.beginPath();
    ctx.arc(x, y, radius + borderWidth, 0, Math.PI * 2);
    ctx.fillStyle = borderColor;
    ctx.fill();
    ctx.restore();
    
    // 흰색 내부 테두리
    ctx.beginPath();
    ctx.arc(x, y, radius + borderWidth / 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // 이미지를 정사각형으로 크롭하여 그리기
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    // 이미지 중앙 크롭
    var imgSize = Math.min(img.width, img.height);
    var sx = (img.width - imgSize) / 2;
    var sy = (img.height - imgSize) / 2;
    
    ctx.drawImage(
      img, 
      sx, sy, imgSize, imgSize,  // 소스 영역 (중앙 크롭)
      x - radius, y - radius, size, size  // 대상 영역
    );
    ctx.restore();
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
   * @param {string} [data.userImageSrc] - 사용자 업로드 이미지 src (base64 data URL)
   * @returns {Promise<Blob>} PNG 이미지 Blob
   */
  function generateResultImage(data) {
    var agency = data.agency || 'hybe';
    var title = data.title || '';
    var explain = data.explain || '';
    var celeb = data.celeb || '';
    var lang = data.lang || 'ko';
    var userImageSrc = data.userImageSrc || null;
    
    // 폰트 로드 대기
    var fontReady = (document.fonts && document.fonts.ready) 
      ? document.fonts.ready 
      : Promise.resolve();
    
    // 사용자 이미지 로드 시도
    var imagePromise = userImageSrc 
      ? loadImage(userImageSrc).catch(function() { return null; })
      : Promise.resolve(null);
    
    return Promise.all([fontReady, imagePromise]).then(function(results) {
      var userImage = results[1];  // 로드된 사용자 이미지 (또는 null)
      
      // 1. Canvas 생성 (인스타 스토리 비율 9:16)
      var canvas = document.createElement('canvas');
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      var ctx = canvas.getContext('2d');
      
      // 2. 소속사별 배경 그라데이션
      var colors = getAgencyColors(agency);
      var gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, colors.main);
      gradient.addColorStop(0.6, colors.sub);
      gradient.addColorStop(1, colors.main);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // 3. 배경 패턴 (미묘한 원형 패턴)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (var i = 0; i < 15; i++) {
        var patternX = Math.random() * CANVAS_WIDTH;
        var patternY = Math.random() * CANVAS_HEIGHT;
        var patternR = 50 + Math.random() * 150;
        ctx.beginPath();
        ctx.arc(patternX, patternY, patternR, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 4. 상단 타이틀
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 52px Pretendard, "Noto Sans KR", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('K-POP Face Test', CANVAS_WIDTH / 2, 120);
      
      // 5. 상단 URL
      ctx.font = '30px Pretendard, "Noto Sans KR", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(SITE_URL, CANVAS_WIDTH / 2, 175);
      
      // 6. 구분선
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(250, 230);
      ctx.lineTo(CANVAS_WIDTH - 250, 230);
      ctx.stroke();
      
      // 7. 사용자 이미지 또는 이모지
      var imageAreaCenterY = USER_IMAGE_Y + USER_IMAGE_SIZE / 2;
      
      if (userImage) {
        // 사용자 이미지가 있으면 원형으로 그리기
        drawCircularImage(
          ctx, 
          userImage, 
          CANVAS_WIDTH / 2, 
          imageAreaCenterY + 50,
          USER_IMAGE_SIZE, 
          colors.border,
          USER_IMAGE_BORDER
        );
      } else {
        // 이미지 없으면 이모지 표시 (fallback)
        ctx.font = '200px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(getAgencyEmoji(agency), CANVAS_WIDTH / 2, imageAreaCenterY + 80);
      }
      
      // 8. 결과 제목 (사진 아래)
      var titleY = userImage ? 880 : 850;
      ctx.font = 'bold 95px Pretendard, "Noto Sans KR", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.fillText(title, CANVAS_WIDTH / 2, titleY);
      
      // 그림자 초기화
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // 9. 해시태그/설명
      var explainY = userImage ? 1000 : 970;
      ctx.font = '40px Pretendard, "Noto Sans KR", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      wrapText(ctx, explain, CANVAS_WIDTH / 2, explainY, 900, 55);
      
      // 10. 대표 연예인 (축약)
      var celebY = userImage ? 1200 : 1170;
      var shortCeleb = truncateText(celeb, 55);
      ctx.font = '34px Pretendard, "Noto Sans KR", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      wrapText(ctx, shortCeleb, CANVAS_WIDTH / 2, celebY, 900, 48);
      
      // 11. 하단 CTA 배경 (둥근 버튼)
      ctx.fillStyle = 'rgba(255, 237, 78, 0.95)';  // 노란색
      roundRect(ctx, 240, 1550, 600, 100, 50);
      ctx.fill();
      
      // CTA 버튼 테두리
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 3;
      roundRect(ctx, 240, 1550, 600, 100, 50);
      ctx.stroke();
      
      // 12. 하단 CTA 텍스트
      ctx.font = 'bold 44px Pretendard, "Noto Sans KR", sans-serif';
      ctx.fillStyle = '#1A1A1A';
      ctx.fillText(getCTAText(lang), CANVAS_WIDTH / 2, 1605);
      
      // 13. URL 워터마크
      ctx.font = '36px Pretendard, "Noto Sans KR", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillText(SITE_URL, CANVAS_WIDTH / 2, 1750);
      
      // 14. 하단 장식선
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(350, 1820);
      ctx.lineTo(CANVAS_WIDTH - 350, 1820);
      ctx.stroke();
      
      // 15. 소속사 로고 느낌의 작은 아이콘 (하단)
      ctx.font = '50px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.fillText(getAgencyEmoji(agency), CANVAS_WIDTH / 2, 1870);
      
      // 16. PNG Blob 반환
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
    loadImage: loadImage,
    drawCircularImage: drawCircularImage
  };
  
  // 버전 정보
  global.imageGeneratorVersion = '2.0.0';

})(typeof window !== 'undefined' ? window : this);

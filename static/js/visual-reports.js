/**
 * 소속사별 비주얼 분석 보고서 데이터
 * 다국어 지원 (15개 언어)
 */
var VisualReportsData = {
  ko: {
    sm: {
      male: {
        title: "SM Entertainment 남자 비주얼 분석 리포트",
        sections: {
          features: "선호 비주얼 특징",
          visuals: "대표 비주얼 라인",
          tips: "오디션 팁",
          strengths: "강점 포인트"
        },
        content: [
          { section: "features", text: "SM은 '조각같은 이목구비'와 '차가운 도시적 이미지'를 가진 남자 아이돌을 선호합니다. 특히 큰 눈, 높고 오똑한 코, 날카로운 턱선을 중시하며, 전체적으로 세련되고 고급스러운 분위기를 추구합니다." },
          { section: "visuals", text: "태용(NCT), 재현(NCT), 카이(EXO), 민호(SHINee), 수호(EXO), 태민(SHINee)" },
          { section: "tips", items: ["시크하고 카리스마 있는 표정 연습 권장", "칼군무에 어울리는 날카로운 이미지 연출", "깔끔한 피부 관리와 세련된 헤어스타일 중요", "SM 특유의 '아이컨택' 연습 필수"] },
          { section: "strengths", text: "당신의 얼굴형은 SM 남자 아이돌 특유의 조각같은 이미지와 잘 맞습니다. 특히 이목구비가 뚜렷하고 세련된 인상이 강점입니다." }
        ]
      },
      female: {
        title: "SM Entertainment 여자 비주얼 분석 리포트",
        sections: { features: "선호 비주얼 특징", visuals: "대표 비주얼 라인", tips: "오디션 팁", strengths: "강점 포인트" },
        content: [
          { section: "features", text: "SM은 '시원한 이목구비'와 '청순하면서 시크한 이미지'를 가진 여자 아이돌을 선호합니다. 큰 눈과 또렷한 이중꺼풀, 높은 코, 갸름한 턱선이 특징입니다." },
          { section: "visuals", text: "카리나(aespa), 윈터(aespa), 아이린(Red Velvet), 유나(소녀시대), 크리스탈(f(x))" },
          { section: "tips", items: ["청순하면서도 시크한 분위기 연출 연습", "피부 베이스 관리 중요", "절제된 표정 속 강렬한 눈빛 연습", "SM 특유의 '걸크러시' 이미지 연구"] },
          { section: "strengths", text: "당신의 얼굴형은 SM 여자 아이돌 특유의 시원하고 세련된 이미지와 잘 맞습니다." }
        ]
      }
    },
    jyp: {
      male: {
        title: "JYP Entertainment 남자 비주얼 분석 리포트",
        sections: { features: "선호 비주얼 특징", visuals: "대표 비주얼 라인", tips: "오디션 팁", strengths: "강점 포인트" },
        content: [
          { section: "features", text: "JYP는 '건강하고 친근한 이미지'와 '자연스러운 매력'을 가진 남자 아이돌을 선호합니다. 화려한 외모보다 순수하고 호감 가는 인상을 높이 평가합니다." },
          { section: "visuals", text: "현진(Stray Kids), 리노(Stray Kids), 진영(GOT7), 준호(2PM)" },
          { section: "tips", items: ["자연스럽고 편안한 미소 연습", "'눈웃음'이 핵심", "건강한 이미지를 위한 체력 관리 중요", "인터뷰 시 진정성 있는 태도"] },
          { section: "strengths", text: "당신의 얼굴형은 JYP 남자 아이돌 특유의 친근하고 호감 가는 이미지와 잘 맞습니다." }
        ]
      },
      female: {
        title: "JYP Entertainment 여자 비주얼 분석 리포트",
        sections: { features: "선호 비주얼 특징", visuals: "대표 비주얼 라인", tips: "오디션 팁", strengths: "강점 포인트" },
        content: [
          { section: "features", text: "JYP는 '건강미'와 '자연스러운 매력'을 가진 여자 아이돌을 선호합니다. 밝고 긍정적인 에너지, '옆집 언니' 같은 친근함이 핵심입니다." },
          { section: "visuals", text: "수지, 나연(TWICE), 사나(TWICE), 류진(ITZY), 예지(ITZY)" },
          { section: "tips", items: ["밝고 건강한 이미지 연출", "자연스러운 미소와 눈웃음 연습", "피부 관리 + 건강한 체형 유지", "자신감 있고 당당한 태도"] },
          { section: "strengths", text: "당신의 얼굴형은 JYP 여자 아이돌 특유의 건강하고 친근한 이미지와 잘 맞습니다." }
        ]
      }
    },
    yg: {
      male: {
        title: "YG Entertainment 남자 비주얼 분석 리포트",
        sections: { features: "선호 비주얼 특징", visuals: "대표 비주얼 라인", tips: "오디션 팁", strengths: "강점 포인트" },
        content: [
          { section: "features", text: "YG는 '독특한 개성'과 '힙한 분위기'를 가진 남자 아이돌을 선호합니다. 자신만의 색깔이 뚜렷한 아티스트를 중시합니다." },
          { section: "visuals", text: "G-Dragon(BIGBANG), 탑(BIGBANG), 송민호(WINNER), 강승윤(WINNER)" },
          { section: "tips", items: ["자신만의 확실한 개성 어필", "패션 센스와 스타일링 감각 중요", "'힙합' 분위기 스웨그 연습", "작사/작곡 능력 어필하면 가산점"] },
          { section: "strengths", text: "당신의 얼굴형은 YG 남자 아이돌 특유의 개성 있고 힙한 이미지와 잘 맞습니다." }
        ]
      },
      female: {
        title: "YG Entertainment 여자 비주얼 분석 리포트",
        sections: { features: "선호 비주얼 특징", visuals: "대표 비주얼 라인", tips: "오디션 팁", strengths: "강점 포인트" },
        content: [
          { section: "features", text: "YG는 '강렬한 개성'과 '걸크러시 이미지'를 가진 여자 아이돌을 선호합니다. 카리스마 있고 당당한 분위기를 중시합니다." },
          { section: "visuals", text: "제니(BLACKPINK), 지수(BLACKPINK), 로제(BLACKPINK), 리사(BLACKPINK), CL(2NE1)" },
          { section: "tips", items: ["강렬하고 당당한 이미지 연출", "무대 위 카리스마와 '스웨그' 연습", "패션 센스와 자기 스타일 확립", "춤/랩 퍼포먼스 실력 어필"] },
          { section: "strengths", text: "당신의 얼굴형은 YG 여자 아이돌 특유의 개성 있고 강렬한 이미지와 잘 맞습니다." }
        ]
      }
    }
  },
  en: {
    sm: {
      male: {
        title: "SM Entertainment Male Visual Analysis Report",
        sections: { features: "Preferred Visual Features", visuals: "Representative Visual Line", tips: "Audition Tips", strengths: "Your Strengths" },
        content: [
          { section: "features", text: "SM prefers male idols with 'sculpted facial features' and a 'cool, urban image'. They emphasize big eyes, a high nose bridge, and a sharp jawline, pursuing an overall sophisticated and luxurious atmosphere." },
          { section: "visuals", text: "Taeyong (NCT), Jaehyun (NCT), Kai (EXO), Minho (SHINee), Suho (EXO), Taemin (SHINee)" },
          { section: "tips", items: ["Practice chic and charismatic expressions", "Create a sharp image suitable for synchronized choreography", "Clean skin care and sophisticated hairstyle are important", "Practice SM's signature 'eye contact'"] },
          { section: "strengths", text: "Your face shape matches the sculpted image typical of SM male idols well. Your distinct features and refined impression are your strengths." }
        ]
      },
      female: {
        title: "SM Entertainment Female Visual Analysis Report",
        sections: { features: "Preferred Visual Features", visuals: "Representative Visual Line", tips: "Audition Tips", strengths: "Your Strengths" },
        content: [
          { section: "features", text: "SM prefers female idols with 'cool facial features' and a 'pure yet chic image'. Big eyes, clear double eyelids, high nose, and slim jawline are key characteristics." },
          { section: "visuals", text: "Karina (aespa), Winter (aespa), Irene (Red Velvet), Yoona (SNSD), Krystal (f(x))" },
          { section: "tips", items: ["Practice both pure and chic vibes", "Focus on skin base care", "Practice intense gaze with controlled expressions", "Study SM's 'girl crush' image"] },
          { section: "strengths", text: "Your face shape matches SM female idols' cool and sophisticated image well." }
        ]
      }
    },
    jyp: {
      male: {
        title: "JYP Entertainment Male Visual Analysis Report",
        sections: { features: "Preferred Visual Features", visuals: "Representative Visual Line", tips: "Audition Tips", strengths: "Your Strengths" },
        content: [
          { section: "features", text: "JYP prefers male idols with a 'healthy, friendly image' and 'natural charm'. They value genuine, likeable impressions over flashy looks." },
          { section: "visuals", text: "Hyunjin (Stray Kids), Lee Know (Stray Kids), Jinyoung (GOT7), Junho (2PM)" },
          { section: "tips", items: ["Practice natural, comfortable smiles", "'Eye smile' is key", "Physical fitness for healthy image is important", "Show sincere attitude in interviews"] },
          { section: "strengths", text: "Your face shape matches JYP male idols' friendly and likeable image well." }
        ]
      },
      female: {
        title: "JYP Entertainment Female Visual Analysis Report",
        sections: { features: "Preferred Visual Features", visuals: "Representative Visual Line", tips: "Audition Tips", strengths: "Your Strengths" },
        content: [
          { section: "features", text: "JYP prefers female idols with 'healthy beauty' and 'natural charm'. Bright, positive energy and a 'girl-next-door' approachability are key." },
          { section: "visuals", text: "Suzy, Nayeon (TWICE), Sana (TWICE), Ryujin (ITZY), Yeji (ITZY)" },
          { section: "tips", items: ["Create bright, healthy image", "Practice natural smiles and eye smiles", "Skin care + maintain healthy physique", "Show confident attitude"] },
          { section: "strengths", text: "Your face shape matches JYP female idols' healthy and friendly image well." }
        ]
      }
    },
    yg: {
      male: {
        title: "YG Entertainment Male Visual Analysis Report",
        sections: { features: "Preferred Visual Features", visuals: "Representative Visual Line", tips: "Audition Tips", strengths: "Your Strengths" },
        content: [
          { section: "features", text: "YG prefers male idols with 'unique personality' and 'hip vibes'. They value artists with a distinct personal style over conventional good looks." },
          { section: "visuals", text: "G-Dragon (BIGBANG), T.O.P (BIGBANG), Mino (WINNER), Kang Seungyoon (WINNER)" },
          { section: "tips", items: ["Appeal your unique personality", "Fashion sense and styling are important", "Practice hip-hop swagger", "Songwriting skills are a plus"] },
          { section: "strengths", text: "Your face shape matches YG male idols' unique and hip image well." }
        ]
      },
      female: {
        title: "YG Entertainment Female Visual Analysis Report",
        sections: { features: "Preferred Visual Features", visuals: "Representative Visual Line", tips: "Audition Tips", strengths: "Your Strengths" },
        content: [
          { section: "features", text: "YG prefers female idols with 'strong personality' and 'girl crush image'. They value charismatic and confident presence." },
          { section: "visuals", text: "Jennie (BLACKPINK), Jisoo (BLACKPINK), Rosé (BLACKPINK), Lisa (BLACKPINK), CL (2NE1)" },
          { section: "tips", items: ["Create intense, confident image", "Practice stage charisma and 'swag'", "Establish fashion sense and personal style", "Appeal dance/rap performance skills"] },
          { section: "strengths", text: "Your face shape matches YG female idols' unique and powerful image well." }
        ]
      }
    }
  },
  ja: {
    sm: {
      male: {
        title: "SM Entertainment 男性ビジュアル分析レポート",
        sections: { features: "好みのビジュアル特徴", visuals: "代表的ビジュアルライン", tips: "オーディションのヒント", strengths: "あなたの強み" },
        content: [
          { section: "features", text: "SMは「彫刻のような目鼻立ち」と「クールで都会的なイメージ」を持つ男性アイドルを好みます。大きな目、高い鼻、シャープな顎のラインを重視します。" },
          { section: "visuals", text: "テヨン(NCT)、ジェヒョン(NCT)、カイ(EXO)、ミンホ(SHINee)、スホ(EXO)" },
          { section: "tips", items: ["シックでカリスマ的な表情を練習", "シンクロダンスに合うシャープなイメージ作り", "清潔な肌管理と洗練されたヘアスタイルが重要", "SM特有の「アイコンタクト」練習必須"] },
          { section: "strengths", text: "あなたの顔立ちはSM男性アイドル特有の彫刻のようなイメージに合っています。" }
        ]
      },
      female: {
        title: "SM Entertainment 女性ビジュアル分析レポート",
        sections: { features: "好みのビジュアル特徴", visuals: "代表的ビジュアルライン", tips: "オーディションのヒント", strengths: "あなたの強み" },
        content: [
          { section: "features", text: "SMは「クールな目鼻立ち」と「清純でシックなイメージ」を持つ女性アイドルを好みます。大きな目、二重まぶた、高い鼻が特徴です。" },
          { section: "visuals", text: "カリナ(aespa)、ウィンター(aespa)、アイリーン(Red Velvet)、ユナ(少女時代)" },
          { section: "tips", items: ["清純でシックな雰囲気を演出", "肌のベースケアが重要", "抑制された表情の中で強い眼差しを練習", "SM特有の「ガールクラッシュ」イメージ研究"] },
          { section: "strengths", text: "あなたの顔立ちはSM女性アイドル特有のクールで洗練されたイメージに合っています。" }
        ]
      }
    },
    jyp: {
      male: {
        title: "JYP Entertainment 男性ビジュアル分析レポート",
        sections: { features: "好みのビジュアル特徴", visuals: "代表的ビジュアルライン", tips: "オーディションのヒント", strengths: "あなたの強み" },
        content: [
          { section: "features", text: "JYPは「健康的で親しみやすいイメージ」と「自然な魅力」を持つ男性アイドルを好みます。派手な外見よりも純粋で好感の持てる印象を高く評価します。" },
          { section: "visuals", text: "ヒョンジン(Stray Kids)、リノ(Stray Kids)、ジニョン(GOT7)、ジュノ(2PM)" },
          { section: "tips", items: ["自然で楽な笑顔を練習", "「目の笑顔」がキー", "健康的なイメージのための体力管理が重要", "インタビューで誠実な態度"] },
          { section: "strengths", text: "あなたの顔立ちはJYP男性アイドル特有の親しみやすく好感の持てるイメージに合っています。" }
        ]
      },
      female: {
        title: "JYP Entertainment 女性ビジュアル分析レポート",
        sections: { features: "好みのビジュアル特徴", visuals: "代表的ビジュアルライン", tips: "オーディションのヒント", strengths: "あなたの強み" },
        content: [
          { section: "features", text: "JYPは「健康美」と「自然な魅力」を持つ女性アイドルを好みます。明るくポジティブなエネルギーと親しみやすさがキーです。" },
          { section: "visuals", text: "スジ、ナヨン(TWICE)、サナ(TWICE)、リュジン(ITZY)、イェジ(ITZY)" },
          { section: "tips", items: ["明るく健康的なイメージ作り", "自然な笑顔と目の笑顔を練習", "肌管理+健康的な体型維持", "自信のある堂々とした態度"] },
          { section: "strengths", text: "あなたの顔立ちはJYP女性アイドル特有の健康的で親しみやすいイメージに合っています。" }
        ]
      }
    },
    yg: {
      male: {
        title: "YG Entertainment 男性ビジュアル分析レポート",
        sections: { features: "好みのビジュアル特徴", visuals: "代表的ビジュアルライン", tips: "オーディションのヒント", strengths: "あなたの強み" },
        content: [
          { section: "features", text: "YGは「ユニークな個性」と「ヒップな雰囲気」を持つ男性アイドルを好みます。自分だけのスタイルがはっきりしたアーティストを重視します。" },
          { section: "visuals", text: "G-Dragon(BIGBANG)、T.O.P(BIGBANG)、ミノ(WINNER)、カン・スンユン(WINNER)" },
          { section: "tips", items: ["自分だけの個性をアピール", "ファッションセンスとスタイリングが重要", "ヒップホップのスワッグを練習", "作詞・作曲能力はプラス"] },
          { section: "strengths", text: "あなたの顔立ちはYG男性アイドル特有のユニークでヒップなイメージに合っています。" }
        ]
      },
      female: {
        title: "YG Entertainment 女性ビジュアル分析レポート",
        sections: { features: "好みのビジュアル特徴", visuals: "代表的ビジュアルライン", tips: "オーディションのヒント", strengths: "あなたの強み" },
        content: [
          { section: "features", text: "YGは「強い個性」と「ガールクラッシュイメージ」を持つ女性アイドルを好みます。カリスマと堂々とした存在感を重視します。" },
          { section: "visuals", text: "ジェニー(BLACKPINK)、ジス(BLACKPINK)、ロゼ(BLACKPINK)、リサ(BLACKPINK)、CL(2NE1)" },
          { section: "tips", items: ["強烈で堂々としたイメージ作り", "ステージでのカリスマと「スワッグ」を練習", "ファッションセンスと自分のスタイルを確立", "ダンス/ラップパフォーマンス能力をアピール"] },
          { section: "strengths", text: "あなたの顔立ちはYG女性アイドル特有のユニークで強いイメージに合っています。" }
        ]
      }
    }
  }
};

// 기타 언어는 영어를 기본으로 사용
['zh', 'de', 'es', 'fr', 'id', 'nl', 'pl', 'pt', 'ru', 'tr', 'uk', 'vi'].forEach(function(lang) {
  if (!VisualReportsData[lang]) {
    VisualReportsData[lang] = VisualReportsData['en'];
  }
});

var VisualReports = {
  /**
   * 보고서 HTML 생성
   * @param {string} agency - 소속사 코드 (sm, jyp, yg)
   * @param {string} gender - 성별 (male, female)
   * @returns {string} HTML 문자열
   */
  getReportHTML: function(agency, gender) {
    // 현재 언어 감지
    var lang = 'ko';
    if (typeof langType !== 'undefined' && langType) {
      lang = langType;
    }

    // 해당 언어 데이터가 없으면 영어로 폴백
    var langData = VisualReportsData[lang] || VisualReportsData['en'];
    var report = langData[agency] && langData[agency][gender];

    if (!report) {
      return '<p>Report not available.</p>';
    }

    var html = '<div class="visual-report">';
    html += '<h3 class="report-title">' + report.title + '</h3>';

    report.content.forEach(function(item) {
      var sectionTitle = report.sections[item.section] || item.section;
      html += '<div class="report-section">';
      html += '<h4 class="section-title">' + sectionTitle + '</h4>';

      if (item.items) {
        html += '<ul class="section-list">';
        item.items.forEach(function(tip) {
          html += '<li>' + tip + '</li>';
        });
        html += '</ul>';
      } else {
        html += '<p class="section-text">' + item.text + '</p>';
      }

      html += '</div>';
    });

    html += '</div>';
    return html;
  }
};

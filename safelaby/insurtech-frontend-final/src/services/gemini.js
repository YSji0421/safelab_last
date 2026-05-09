import { matchScenario } from './scenarioMatcher';
import { LAB_SAFETY_CONTEXT, LAB_SAFETY_QUIZ_HINTS } from '../data/labsafetyExcerpt';
import { getDepartment } from '../data/departments';

// API 키는 환경변수에서만 읽음. 코드에 절대 하드코딩 금지.
// - 로컬 개발: insurtech-frontend/.env.local 에 REACT_APP_GEMINI_API_KEY=...
// - Vercel: 프로젝트 Settings → Environment Variables 에 동일 이름으로 추가
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const callGemini = async (prompt, { temperature = 0.4, maxOutputTokens = 1500 } = {}) => {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature, maxOutputTokens },
    }),
  });
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text.replace(/```json|```/g, '').trim();
};

const safeJsonParse = (text, fallback) => {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) return fallback;
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return fallback;
  }
};

export const isGeminiConfigured = () => GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE';

// ─────────────────────────────────────────────────────────
// 안전교육 시나리오 생성
// ─────────────────────────────────────────────────────────
export const generateSafetyScenario = async (deptId, scenarioId) => {
  const dept = getDepartment(deptId);
  const scenario = dept?.scenarios.find((s) => s.id === scenarioId);
  if (!dept || !scenario) {
    return { source: 'fallback', steps: getMockScenarioSteps('chem', 'chem-1') };
  }

  if (!isGeminiConfigured()) {
    return { source: 'fallback', steps: getMockScenarioSteps(deptId, scenarioId) };
  }

  const prompt = `당신은 한국 공과대학 실험실 안전교육 강사 AI 입니다.
아래 약관 컨텍스트를 참고해서 학생이 1인칭 시점으로 사고를 체험·대처하도록 4단계 시나리오를 만드세요.

[약관 컨텍스트]
${LAB_SAFETY_CONTEXT}

[학과] ${dept.name}
[사고 시나리오] ${scenario.title}
[사고 개요] ${scenario.summary}
[관련 조항] ${scenario.relatedClause}

JSON만 출력 (마크다운 금지):
{
  "steps": [
    {
      "phase": "사고 발생|즉시 대응|2차 조치|사후 신고 중 하나",
      "narration": "1인칭 사고 묘사 2-3문장",
      "question": "지금 학생이 해야 할 행동을 묻는 질문",
      "choices": [
        {"text": "선택지A", "correct": false, "feedback": "왜 잘못됐는지 한문장"},
        {"text": "선택지B", "correct": true, "feedback": "왜 맞는지 한문장 (약관 조항 인용)"},
        {"text": "선택지C", "correct": false, "feedback": "왜 잘못됐는지 한문장"}
      ]
    }
    // 4개 phase 반드시 포함
  ]
}`;

  try {
    const text = await callGemini(prompt, { temperature: 0.5, maxOutputTokens: 2200 });
    const parsed = safeJsonParse(text, null);
    if (parsed?.steps?.length >= 3) return { source: 'ai', steps: parsed.steps };
    return { source: 'fallback', steps: getMockScenarioSteps(deptId, scenarioId) };
  } catch {
    return { source: 'fallback', steps: getMockScenarioSteps(deptId, scenarioId) };
  }
};

// ─────────────────────────────────────────────────────────
// 안전교육 퀴즈 생성 (시나리오 후 5문항)
// ─────────────────────────────────────────────────────────
export const generateSafetyQuiz = async (deptId, scenarioId) => {
  const dept = getDepartment(deptId);
  const scenario = dept?.scenarios.find((s) => s.id === scenarioId);

  if (!isGeminiConfigured() || !dept || !scenario) {
    return { source: 'fallback', questions: getMockQuiz(deptId, scenarioId) };
  }

  const hintsText = LAB_SAFETY_QUIZ_HINTS
    .map((h) => `- "${h.fact}" (${h.truth ? '참' : '거짓'}, ${h.ref})`)
    .join('\n');

  const prompt = `「연구실안전공제」 약관 기반 안전교육 퀴즈를 만드세요.
학생이 방금 다음 시나리오를 학습했습니다: "${scenario.title}" (${dept.name})

[약관 컨텍스트]
${LAB_SAFETY_CONTEXT}

[참조 가능한 사실들]
${hintsText}

5개 객관식 문제를 JSON으로 출력 (마크다운 금지):
{
  "questions": [
    {
      "q": "질문 본문",
      "choices": ["A", "B", "C", "D"],
      "answer": 0,
      "explain": "정답 설명 — 약관 조항 명시"
    }
    // 5개
  ]
}
난이도: 쉬움 1, 중간 3, 어려움 1. 보상되는 손해/제외사유/통지의무/장해등급/단체계약 중 골고루.`;

  try {
    const text = await callGemini(prompt, { temperature: 0.3, maxOutputTokens: 2000 });
    const parsed = safeJsonParse(text, null);
    if (parsed?.questions?.length >= 5) return { source: 'ai', questions: parsed.questions };
    return { source: 'fallback', questions: getMockQuiz(deptId, scenarioId) };
  } catch {
    return { source: 'fallback', questions: getMockQuiz(deptId, scenarioId) };
  }
};

export const analyzeConsultation = async (transcript, accidentType = "교통사고") => {
  const matched = matchScenario(transcript);
  if (matched) {
    return {
      ...matched.scenario.analysis,
      source: 'mock',
      matchedScenarioId: matched.scenario.id,
      matchedScenarioName: matched.scenario.name,
      matchScore: matched.score
    };
  }

  if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    return { ...getMockAnalysis(transcript), source: 'fallback' };
  }

  const prompt = `당신은 보험 손해사정 전문 AI입니다.
다음 상담 내용을 분석하여 JSON만 반환하세요 (설명 없이):
상담내용: "${transcript}"
사고유형: ${accidentType}

{
  "summary": "3줄 요약",
  "keywords": ["키워드1","키워드2","키워드3","키워드4","키워드5"],
  "clauseRefs": ["제12조","제15조"],
  "customerTone": "불안|차분|불만|적극적 중 하나",
  "riskLevel": "낮음|보통|높음 중 하나",
  "actionItems": ["후속조치1","후속조치2","후속조치3"],
  "settlementHint": "예상 합의 방향 한 문장"
}`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.3, maxOutputTokens: 1024 } })
    });
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return { ...parsed, source: 'ai' };
  } catch {
    return { ...getMockAnalysis(transcript), source: 'fallback' };
  }
};

const getMockAnalysis = () => ({
  summary: "고객이 교통사고로 인한 경추·요추 염좌 진단을 받았으며, 보험사의 조기 합의 요청에 대한 검토를 의뢰함. 치료 기간 및 합의금 산정이 주요 쟁점이며 후유장해 가능성도 있음.",
  keywords: ["후유장해", "치료비", "합의금", "과실비율", "대인배상"],
  clauseRefs: ["제12조 (계약 해지)", "제15조 (보험금 청구)", "제18조 (손해배상)"],
  customerTone: "불안",
  riskLevel: "보통",
  actionItems: ["치료 종결 전 합의 거절 권고", "후유장해 진단서 발급 필요", "과실비율 재산정 요청"],
  settlementHint: "치료 종결 후 후유장해 여부 확인 뒤 합의 진행 권장"
});

// ─────────────────────────────────────────────────────────
// Mock 시나리오 (Gemini 키 없을 때 fallback)
// ─────────────────────────────────────────────────────────
const MOCK_SCENARIOS = {
  'chem-1': [
    {
      phase: '사고 발생',
      narration: '실험대 위에서 황산을 옮기던 중 손등에 한 방울이 튀었습니다. 손등이 따끔거리고 빨갛게 변하기 시작합니다.',
      question: '지금 가장 먼저 해야 할 행동은?',
      choices: [
        { text: '실험을 마저 끝내고 처리한다', correct: false, feedback: '강산은 즉시 세척하지 않으면 화상이 깊어집니다.' },
        { text: '비상 샤워/세안기로 달려가 흐르는 물에 15분 이상 세척한다', correct: true, feedback: '약관 제3조 보상 대상 화상 — 즉시 세척이 1차 조치입니다.' },
        { text: '연고를 바른다', correct: false, feedback: '연고는 산을 가두어 화상을 악화시킵니다.' },
      ],
    },
    {
      phase: '즉시 대응',
      narration: '15분 세척 후에도 통증이 가시지 않고 피부가 하얗게 변합니다.',
      question: '어떻게 해야 할까요?',
      choices: [
        { text: '동료에게 말하지 않고 보건실로 혼자 간다', correct: false, feedback: '실험실 사고는 반드시 책임자에게 보고해야 합니다.' },
        { text: '책임 교수/안전관리자에게 알리고 119에 신고한다', correct: true, feedback: '약관 제11조 — 사고 인지 즉시 통지 의무.' },
        { text: '카카오톡으로만 알리고 계속 작업한다', correct: false, feedback: '서면·전화로 즉시 통지해야 합니다.' },
      ],
    },
    {
      phase: '2차 조치',
      narration: '응급실로 이동하여 처치 중입니다.',
      question: '병원에서 받아야 할 가장 중요한 서류는?',
      choices: [
        { text: '약 처방전만 받아둔다', correct: false, feedback: '진단서가 청구의 핵심 서류입니다.' },
        { text: '진단서(상병명·상병코드 포함)와 진료비 계산서', correct: true, feedback: '약관 제12조에 명시된 청구 필수서류입니다.' },
        { text: '병원 영수증만 모은다', correct: false, feedback: '영수증만으로는 보장 청구가 불가합니다.' },
      ],
    },
    {
      phase: '사후 신고',
      narration: '치료 후 학교에 복귀했습니다.',
      question: '연구실안전공제 청구 절차로 옳은 것은?',
      choices: [
        { text: '졸업할 때까지 모아서 한꺼번에 청구한다', correct: false, feedback: '청구권은 3년 소멸시효(약관 제26조).' },
        { text: '연구주체의 장 사고경위서와 함께 한국교육시설안전원에 청구한다', correct: true, feedback: '약관 제12조 청구서류 — 사고경위서 필수.' },
        { text: '본인 사보험에만 청구한다', correct: false, feedback: '연구실안전공제는 별개 — 우선 청구 후 정산 가능합니다.' },
      ],
    },
  ],
  'chem-2': [
    { phase: '사고 발생', narration: '드래프트 챔버가 정지된 채로 염소가스 냄새가 강하게 납니다. 호흡이 답답해집니다.',
      question: '가장 먼저 할 행동은?',
      choices: [
        { text: '창문을 활짝 열고 그 자리에 머문다', correct: false, feedback: '오염 공기 노출이 길어집니다.' },
        { text: '즉시 문 밖으로 대피하며 동료를 부른다', correct: true, feedback: '약관 제3조 ② 유독가스 흡입 중독 보장 — 단, 노출 최소화가 우선.' },
        { text: '가스 차단 밸브를 찾아 닫는다', correct: false, feedback: '본인 안전 확보가 먼저, 차단은 보호장구 착용 후.' },
      ] },
    { phase: '즉시 대응', narration: '복도에 나와 신선한 공기를 마시는 중입니다. 기침이 멈추지 않습니다.',
      question: '어떻게 해야 할까요?',
      choices: [
        { text: '잠시 쉬다가 다시 들어간다', correct: false, feedback: '재노출 시 중증화상·폐손상 위험.' },
        { text: '119 신고하고 안전관리자에게 통보 후 응급실 이송', correct: true, feedback: '제11조 통지 의무 + 응급조치.' },
        { text: '인터넷에서 응급처치를 찾는다', correct: false, feedback: '시간 낭비 — 즉시 119.' },
      ] },
    { phase: '2차 조치', narration: '응급실에서 산소 치료를 받고 있습니다.',
      question: '입원이 길어질 경우 보장되는 것은?',
      choices: [
        { text: '치료비만 보장된다', correct: false, feedback: '입원급여, 등록금 손실 지원도 가능.' },
        { text: '15일 이상 입원 시 등록금 100만원, 기숙사비 30만원까지 손실 지원', correct: true, feedback: '특약 제1장.' },
        { text: '아무것도 보장되지 않는다', correct: false, feedback: '연구실안전공제 보장 대상.' },
      ] },
    { phase: '사후 신고', narration: '치료 종료 후 학교 복귀.',
      question: '청구 시 필요한 서류는?',
      choices: [
        { text: '본인 신분증만', correct: false, feedback: '진단서·사고경위서·청구서 모두 필요.' },
        { text: '청구서 + 사고증명서 + 신분증 + 사고경위서', correct: true, feedback: '약관 제12조.' },
        { text: '카카오톡 대화 캡쳐', correct: false, feedback: '공식 서류만 인정.' },
      ] },
  ],
  'mech-1': [
    { phase: '사고 발생', narration: '선반 작업 중 작업복 소매가 회전 척에 빨려 들어갑니다.',
      question: '즉시 취해야 할 조치는?',
      choices: [
        { text: '소매를 잡아당겨 빼낸다', correct: false, feedback: '회전 중 잡아당기면 더 깊이 끌려갑니다.' },
        { text: '비상정지 버튼을 누른다', correct: true, feedback: '동력 차단이 절대 1순위.' },
        { text: '동료에게 전화한다', correct: false, feedback: '비상정지가 먼저, 호출은 그 다음.' },
      ] },
    { phase: '즉시 대응', narration: '기계가 멈췄지만 손목에 통증이 있고 부어오릅니다.',
      question: '다음 단계는?',
      choices: [
        { text: '얼음찜질하고 작업 계속', correct: false, feedback: '골절 가능성 — 의료진 진단 필수.' },
        { text: '실습실 책임교수에 보고하고 응급실 이송', correct: true, feedback: '제11조 통지 + 적절한 진단.' },
        { text: '약국에서 파스만 사서 붙인다', correct: false, feedback: '공식 진단서 없이는 청구 불가.' },
      ] },
    { phase: '2차 조치', narration: '응급실에서 손목 골절 진단을 받았습니다.',
      question: '후유장해가 남을 가능성이 있는 경우 어떤 서류가 추가로 필요한가요?',
      choices: [
        { text: '없다', correct: false, feedback: '장해진단서 필요.' },
        { text: '치료 종결 후 장해진단서 발급', correct: true, feedback: '약관 제6조 장해급여 — 별표1 등급 판정.' },
        { text: '본인 일기장', correct: false, feedback: '의료기관 발급 서류만 인정.' },
      ] },
    { phase: '사후 신고', narration: '치료 종결, 장해등급 산정 절차 안내를 받았습니다.',
      question: '두 팔을 완전히 사용하지 못하게 됐다면 후유장해 등급은?',
      choices: [
        { text: '14급', correct: false, feedback: '14급은 가장 경증입니다.' },
        { text: '1급 (2억원 보상)', correct: true, feedback: '별표1 1급 — 두 팔 완전 사용 불능.' },
        { text: '7급', correct: false, feedback: '7급은 더 경증입니다.' },
      ] },
  ],
  'mech-2': [
    { phase: '사고 발생', narration: '보안경 없이 그라인더를 사용하던 중 파편이 튀어 눈을 찔렀습니다.',
      question: '즉시 해야 할 일은?',
      choices: [
        { text: '눈을 비빈다', correct: false, feedback: '추가 손상 — 절대 비비면 안 됩니다.' },
        { text: '눈을 감고 안과 응급실 직행', correct: true, feedback: '안구 보호 — 시력 손실은 별표1 1~3급 후유장해.' },
        { text: '식염수를 잔뜩 부어본다', correct: false, feedback: '관통상일 수 있어 안과 진료가 우선.' },
      ] },
    { phase: '즉시 대응', narration: '안과로 이동 중. 동료가 물어보면?',
      question: '동료에게 가장 먼저 부탁할 것은?',
      choices: [
        { text: 'SNS에 사진 찍어달라고', correct: false, feedback: '시간 낭비.' },
        { text: '실습실 책임교수와 안전관리실에 즉시 보고', correct: true, feedback: '제11조 통지 의무.' },
        { text: '집에 데려다달라고', correct: false, feedback: '응급실이 먼저.' },
      ] },
    { phase: '2차 조치', narration: '진료 결과 시력에 손상이 남을 가능성이 있습니다.',
      question: '필요한 후속 조치는?',
      choices: [
        { text: '치료 종결까지 기다렸다가 한꺼번에 처리', correct: false, feedback: '신고는 즉시여야 합니다.' },
        { text: '즉시 안전원 통지, 치료 종결 후 장해진단서 발급', correct: true, feedback: '제11조 + 제6조.' },
        { text: '교내 동아리에 알린다', correct: false, feedback: '공식 라인이 우선.' },
      ] },
    { phase: '사후 신고', narration: '시력이 0.06 이하로 영구 고정.',
      question: '한 눈 실명 + 다른 눈 시력 0.06이면?',
      choices: [
        { text: '14급', correct: false, feedback: '훨씬 중증입니다.' },
        { text: '3급 (1.6억원)', correct: true, feedback: '별표1 3급 — 한 눈 실명+0.06 이하.' },
        { text: '1급', correct: false, feedback: '1급은 두 눈 실명.' },
      ] },
  ],
  'elec-1': [
    { phase: '사고 발생', narration: '활선 차단을 확인하지 않고 배전반에 손을 댔다가 감전됐습니다.',
      question: '주변 동료가 가장 먼저 해야 할 일은?',
      choices: [
        { text: '맨손으로 끌어당긴다', correct: false, feedback: '동반 감전 위험.' },
        { text: '메인 차단기를 내리고 절연 도구로 분리', correct: true, feedback: '안전 확보 후 구조.' },
        { text: '소리쳐 부른다', correct: false, feedback: '도움 요청은 차단과 동시에.' },
      ] },
    { phase: '즉시 대응', narration: '의식이 흐려지고 호흡이 약합니다.',
      question: '응급조치는?',
      choices: [
        { text: '심폐소생술 + 119 동시 호출', correct: true, feedback: '감전은 심정지 위험.' },
        { text: '깨울 때까지 흔든다', correct: false, feedback: '시간 낭비.' },
        { text: '물을 끼얹는다', correct: false, feedback: '재감전 위험.' },
      ] },
    { phase: '2차 조치', narration: '응급실 이송 중.',
      question: '학교 측에 가장 먼저 알릴 곳은?',
      choices: [
        { text: '학생회', correct: false, feedback: '안전 라인이 우선.' },
        { text: '전기정보과 안전관리자 + 안전관리실', correct: true, feedback: '제11조 통지 의무.' },
        { text: '도서관', correct: false, feedback: '관련 없음.' },
      ] },
    { phase: '사후 신고', narration: '신경계통 후유장해 진단.',
      question: '신경계 장해로 항상 간병이 필요한 경우 등급은?',
      choices: [
        { text: '1급 (2억)', correct: true, feedback: '별표1 1급 — 신경계 항상 간병.' },
        { text: '8급', correct: false, feedback: '경증 등급.' },
        { text: '대상 아님', correct: false, feedback: '명확한 보상 대상.' },
      ] },
  ],
  'elec-2': [
    { phase: '사고 발생', narration: '실습실 분전반에서 불꽃이 튀고 연기가 나기 시작합니다.',
      question: '즉시 행동?',
      choices: [
        { text: '물을 뿌려 끈다', correct: false, feedback: '전기 화재에 물은 절대 금지.' },
        { text: '메인 차단기 내리고 ABC분말소화기 사용', correct: true, feedback: '전기화재 표준 대응.' },
        { text: '도망간다', correct: false, feedback: '초기 진압 우선, 안 되면 대피 + 119.' },
      ] },
    { phase: '즉시 대응', narration: '연기를 흡입해 기침이 심해집니다.',
      question: '대피 후 조치는?',
      choices: [
        { text: '잠시 쉬고 들어간다', correct: false, feedback: '재진입 금지.' },
        { text: '119 신고 + 응급실 이송 + 학과 안전관리자 통보', correct: true, feedback: '제11조 + 응급.' },
        { text: '도서관에서 자료 정리', correct: false, feedback: '비합리.' },
      ] },
    { phase: '2차 조치', narration: '진단: 중등도 화상 + 연기 흡입.',
      question: '특약상 어떤 보상이 가능한가요?',
      choices: [
        { text: '없다', correct: false, feedback: '특약 보장.' },
        { text: '중등도 화상치료 간접지원금 — 공제가입금액의 40%', correct: true, feedback: '특약 제4장.' },
        { text: '100만원 정액', correct: false, feedback: '비율 지급.' },
      ] },
    { phase: '사후 신고', narration: '입원 20일 경과.',
      question: '입원급여 지급 기간은?',
      choices: [
        { text: '입원 1일째부터 30일', correct: false, feedback: '4일째부터입니다.' },
        { text: '입원 4일째부터 최대 30일', correct: true, feedback: '약관 제9조.' },
        { text: '평생', correct: false, feedback: '한도 30일.' },
      ] },
  ],
  'comp-1': [
    { phase: '사고 발생', narration: '서버실 UPS에서 타는 냄새가 나고 연기가 보입니다.',
      question: '즉시 조치?',
      choices: [
        { text: '서버를 정상 종료한 후 처리', correct: false, feedback: '시간 지연 — 인명이 우선.' },
        { text: '대피 + 119 + 메인 전원 차단', correct: true, feedback: '인명 → 신고 → 차단 순서.' },
        { text: '동영상을 찍는다', correct: false, feedback: '비합리.' },
      ] },
    { phase: '즉시 대응', narration: '복도에서 119를 기다리는 중. 동료가 안 보입니다.',
      question: '어떻게 해야 할까요?',
      choices: [
        { text: '본인이 다시 들어가 찾는다', correct: false, feedback: '소방관에게 위치 정보 제공이 안전.' },
        { text: '119 도착 시 동료 위치 정보 전달', correct: true, feedback: '구조 전문가에게 맡기는 것이 안전.' },
        { text: '아무것도 안 한다', correct: false, feedback: '정보 전달은 필수.' },
      ] },
    { phase: '2차 조치', narration: '연기 흡입으로 응급실 진료.',
      question: '필요한 사고 서류는?',
      choices: [
        { text: '진료비 영수증만', correct: false, feedback: '진단서 필수.' },
        { text: '진단서, 진료비계산서, 사고경위서', correct: true, feedback: '제12조.' },
        { text: '본인 메모', correct: false, feedback: '공식 서류만 인정.' },
      ] },
    { phase: '사후 신고', narration: '실습 중 사고로 인정.',
      question: '컴퓨터정보과 학생도 연구실안전공제 대상인가요?',
      choices: [
        { text: '아니다', correct: false, feedback: '학과 단체가입 시 자동 보장.' },
        { text: '맞다 — 학과 전체 가입 시 자동 담보', correct: true, feedback: '단체계약 특약 제3조.' },
        { text: '대학원생만', correct: false, feedback: '학부생도 해당.' },
      ] },
  ],
  'comp-2': [
    { phase: '사고 발생', narration: '팀 프로젝트 밤샘 중 동료가 갑자기 의식이 흐려집니다.',
      question: '가장 먼저 할 일은?',
      choices: [
        { text: 'SNS 검색', correct: false, feedback: '시간 낭비.' },
        { text: '의식·호흡 확인 후 119 신고', correct: true, feedback: '응급처치 1순위.' },
        { text: '깨어날 때까지 기다린다', correct: false, feedback: '심정지 가능성 — 즉시 신고.' },
      ] },
    { phase: '즉시 대응', narration: '119 출동 대기 중. 동료가 의식을 잃은 상태.',
      question: '추가 조치?',
      choices: [
        { text: '얼굴에 물을 끼얹는다', correct: false, feedback: '효과 없음.' },
        { text: '회복 자세 + 기도 확보, 호흡 모니터링', correct: true, feedback: '응급처치 표준.' },
        { text: '카페인 음료를 입에 넣는다', correct: false, feedback: '의식없는 사람에게 음식 금지.' },
      ] },
    { phase: '2차 조치', narration: '응급실 진단: 탈수 및 영양실조. 입원 권고.',
      question: '학교 보고는?',
      choices: [
        { text: '본인이 회복 후 직접 보고', correct: false, feedback: '즉시 통지가 원칙.' },
        { text: '실습 중 사고로 학과·안전원에 즉시 통지', correct: true, feedback: '제11조.' },
        { text: '동아리에만 알린다', correct: false, feedback: '공식 라인.' },
      ] },
    { phase: '사후 신고', narration: '청구 절차.',
      question: '청구권 소멸시효는?',
      choices: [
        { text: '1년', correct: false, feedback: '아닙니다.' },
        { text: '3년', correct: true, feedback: '약관 제26조.' },
        { text: '10년', correct: false, feedback: '아닙니다.' },
      ] },
  ],
};

const getMockScenarioSteps = (deptId, scenarioId) => {
  return MOCK_SCENARIOS[scenarioId] || MOCK_SCENARIOS['chem-1'];
};

// ─────────────────────────────────────────────────────────
// Mock 퀴즈 (5문항)
// ─────────────────────────────────────────────────────────
const MOCK_QUIZ_BASE = [
  {
    q: '연구실에서 실험 중 발생한 사고는 다음 중 어느 경우 보상되는가?',
    choices: [
      '본인의 과실이 없을 때만',
      '과실 유무를 가리지 않고 보상',
      '실험책임자 동의가 있을 때만',
      '학과장 승인이 있을 때만',
    ],
    answer: 1,
    explain: '약관 제3조 — 과실 유무를 가리지 않고 보상.',
  },
  {
    q: '연구실안전공제로 보상받지 못하는 경우는?',
    choices: [
      '실험 중 유독가스 흡입',
      '본인의 자살미수',
      '실험기구 사용 중 화상',
      '연구활동 중 추락',
    ],
    answer: 1,
    explain: '약관 제10조 3호 — 자해·자살미수는 제외사유.',
  },
  {
    q: '사고 발생 시 통지 의무에 대한 설명으로 맞는 것은?',
    choices: [
      '치료 종료 후 한꺼번에 신고',
      '사고 인지 즉시 안전원에 통지해야 함',
      '학기 말에 신고',
      '본인 회복 후 신고',
    ],
    answer: 1,
    explain: '약관 제11조 — 지체 없이 통지, 게을리 시 증가 손해 미보상.',
  },
  {
    q: '두 눈이 실명된 경우 후유장해 등급과 보상금액은?',
    choices: [
      '1급 — 2억원',
      '5급 — 1.2억원',
      '8급 — 6천만원',
      '14급 — 1천만원',
    ],
    answer: 0,
    explain: '별표1 1급 — 두 눈 실명 시 2억원.',
  },
  {
    q: '학과 전체인원이 가입한 단체계약의 신입생은?',
    choices: [
      '재가입 절차 필요',
      '추가 학적등록만으로 자동 담보',
      '본인이 별도 신청',
      '보장 안 됨',
    ],
    answer: 1,
    explain: '단체계약 특약 제3조 — 학과 전체 가입 시 자동 담보.',
  },
];

const getMockQuiz = (deptId, scenarioId) => {
  return MOCK_QUIZ_BASE;
};

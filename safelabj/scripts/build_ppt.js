// SafeLab 발표 PPT 생성 스크립트
// 실행: node build_ppt.js
const pptxgen = require('pptxgenjs');

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.3" x 7.5"
pres.author = '인슈어테크';
pres.title = 'SafeLab — 인하공전 연구실 안전 통합 플랫폼';
pres.subject = '2026 학교 경진대회';

// 디자인 토큰
const C = {
  red:        'E60000',
  redDark:    'B30000',
  redLight:   'FFE5E5',
  redSoft:    'FFF8F8',
  ink:        '1A1A1A',
  sub:        '6B7280',
  border:     'E5E7EB',
  cream:      'FCF6F5',
  bg:         'F5F5F7',
  white:      'FFFFFF',
  navy:       '2F3C7E',
  green:      '15803D',
  greenLight: 'DCFCE7',
  amber:      'F59E0B',
  amberLight: 'FEF3C7',
};

const FONT_HEAD = 'Arial Black';
const FONT_BODY = 'Arial';

// 공통 헬퍼: 좌측 빨간 컬러바 + 풋터
const addChrome = (slide, pageNum, total) => {
  // 좌측 컬러바
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 7.5, fill: { color: C.red }, line: { color: C.red, width: 0 },
  });
  // 풋터
  slide.addText('SafeLab · 인슈어테크 · 2026 인하공전 경진대회', {
    x: 0.4, y: 7.15, w: 8, h: 0.3,
    fontSize: 9, fontFace: FONT_BODY, color: C.sub,
  });
  slide.addText(`${pageNum} / ${total}`, {
    x: 12.0, y: 7.15, w: 1.0, h: 0.3,
    fontSize: 9, fontFace: FONT_BODY, color: C.sub, align: 'right',
  });
};

const TOTAL = 13;

// ─────────────────────────────────────────────
// 1. 표지
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.red };

  // 우측 큰 화이트 패널
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.6, y: 0, w: 6.7, h: 7.5,
    fill: { color: C.white }, line: { color: C.white, width: 0 },
  });

  // 좌측 빨강 영역의 큰 텍스트
  s.addText('🛡️', { x: 0.6, y: 0.6, w: 1.5, h: 1.2, fontSize: 60 });

  s.addText('SafeLab', {
    x: 0.6, y: 1.7, w: 6, h: 1.2,
    fontSize: 64, fontFace: FONT_HEAD, color: C.white, bold: true,
  });

  s.addText('인하공전 연구실 안전 통합 플랫폼', {
    x: 0.6, y: 2.9, w: 6, h: 0.6,
    fontSize: 20, fontFace: FONT_BODY, color: C.white,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 3.7, w: 0.5, h: 0.06,
    fill: { color: C.white }, line: { color: C.white, width: 0 },
  });

  s.addText([
    { text: '「연구실안전공제」 약관 기반', options: { breakLine: true, fontSize: 14, color: C.white } },
    { text: 'AI 시나리오 + 학과 단체가입 연계', options: { fontSize: 14, color: C.white } },
  ], { x: 0.6, y: 3.9, w: 6, h: 0.9, fontFace: FONT_BODY, margin: 0 });

  // 우측 메타
  s.addText('2026 학교 경진대회 출품작', {
    x: 7.0, y: 1.0, w: 5.8, h: 0.5,
    fontSize: 12, fontFace: FONT_BODY, color: C.red, bold: true, charSpacing: 4,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.0, y: 1.5, w: 0.6, h: 0.06,
    fill: { color: C.red }, line: { color: C.red, width: 0 },
  });

  s.addText('팀 인슈어테크', {
    x: 7.0, y: 1.8, w: 5.8, h: 0.6,
    fontSize: 28, fontFace: FONT_HEAD, color: C.ink, bold: true,
  });

  // 팀원
  s.addText('이예진 · 지윤석', {
    x: 7.0, y: 2.5, w: 5.8, h: 0.5,
    fontSize: 16, fontFace: FONT_BODY, color: C.ink, bold: true, margin: 0,
  });

  // 우측 카드 — "한 줄 요약"
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 7.0, y: 3.7, w: 5.8, h: 2.9,
    fill: { color: C.cream }, line: { color: C.redLight, width: 1 }, rectRadius: 0.15,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.3, y: 3.95, w: 0.4, h: 0.05,
    fill: { color: C.red }, line: { color: C.red, width: 0 },
  });

  s.addText('CONCEPT', {
    x: 7.3, y: 4.05, w: 5.2, h: 0.35,
    fontSize: 11, fontFace: FONT_HEAD, color: C.red, bold: true, charSpacing: 4,
  });

  s.addText([
    { text: '형식적 안전교육을\n', options: { color: C.sub, fontSize: 14, fontFace: FONT_BODY, bold: false } },
    { text: '학과 단위 ', options: { color: C.ink, fontSize: 22, fontFace: FONT_HEAD, bold: true } },
    { text: 'AI 시나리오 + 약관 퀴즈', options: { color: C.red, fontSize: 22, fontFace: FONT_HEAD, bold: true } },
    { text: '로\n', options: { color: C.ink, fontSize: 22, fontFace: FONT_HEAD, bold: true } },
    { text: '실효성 있게 — ', options: { color: C.ink, fontSize: 22, fontFace: FONT_HEAD, bold: true } },
    { text: '단체공제 가입까지', options: { color: C.red, fontSize: 22, fontFace: FONT_HEAD, bold: true } },
  ], {
    x: 7.3, y: 4.4, w: 5.2, h: 1.85, margin: 0,
  });

  s.addText('2026.05.02', {
    x: 7.3, y: 6.25, w: 5.2, h: 0.3,
    fontSize: 11, fontFace: FONT_BODY, color: C.sub,
  });
}

// ─────────────────────────────────────────────
// 2. 문제 정의
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addChrome(s, 2, TOTAL);

  s.addText('PROBLEM', {
    x: 0.6, y: 0.5, w: 5, h: 0.4,
    fontSize: 12, fontFace: FONT_HEAD, color: C.red, bold: true, charSpacing: 6,
  });

  s.addText([
    { text: '매학기 안전교육,\n', options: {} },
    { text: '왜 ', options: { color: C.ink } },
    { text: '실효성', options: { color: C.red } },
    { text: '이 없는가?', options: { color: C.ink } },
  ], {
    x: 0.6, y: 0.95, w: 12, h: 1.5,
    fontSize: 38, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
  });

  // 3가지 카드
  const items = [
    { num: '01', title: 'PPT 클릭 한 번', desc: '몇십 장짜리 슬라이드 자동재생, 그냥 다른 작업 하면서 시간 떼우기' },
    { num: '02', title: '학과 무관 일반론', desc: '화공·기계·전기 어느 학과든 똑같은 자료. 본인 실험실 위험은 안 다룸' },
    { num: '03', title: '사고 시 행동 모름', desc: '교육 끝나도 정작 사고 발생 시 119 외에 누구에게 어떻게 알릴지 막막' },
  ];

  items.forEach((it, i) => {
    const x = 0.6 + i * 4.15;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 2.7, w: 3.95, h: 4.0,
      fill: { color: C.white }, line: { color: C.border, width: 1 }, rectRadius: 0.15,
      shadow: { type: 'outer', color: '000000', blur: 8, offset: 2, angle: 90, opacity: 0.06 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.7, w: 3.95, h: 0.08,
      fill: { color: C.red }, line: { color: C.red, width: 0 },
    });
    s.addText(it.num, {
      x: x + 0.3, y: 2.95, w: 1, h: 0.6,
      fontSize: 32, fontFace: FONT_HEAD, color: C.red, bold: true, margin: 0,
    });
    s.addText(it.title, {
      x: x + 0.3, y: 3.65, w: 3.4, h: 0.6,
      fontSize: 19, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
    });
    s.addText(it.desc, {
      x: x + 0.3, y: 4.3, w: 3.4, h: 2.0,
      fontSize: 13, fontFace: FONT_BODY, color: C.sub, margin: 0,
    });
  });
}

// ─────────────────────────────────────────────
// 3. 솔루션 한 장 요약
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addChrome(s, 3, TOTAL);

  s.addText('OUR SOLUTION', {
    x: 0.6, y: 0.5, w: 5, h: 0.4,
    fontSize: 12, fontFace: FONT_HEAD, color: C.red, bold: true, charSpacing: 6,
  });

  s.addText([
    { text: '학과별 ', options: { color: C.ink } },
    { text: 'AI 시나리오', options: { color: C.red } },
    { text: ' +\n', options: { color: C.ink } },
    { text: '약관 기반 퀴즈 → ', options: { color: C.ink } },
    { text: '단체가입 연계', options: { color: C.red } },
  ], {
    x: 0.6, y: 0.95, w: 12, h: 1.8,
    fontSize: 38, fontFace: FONT_HEAD, bold: true, margin: 0,
  });

  // 4단계 흐름 카드
  const steps = [
    { ic: '🎯', t: '학과 선택', d: '화공·기계·전기·컴공\n맞춤 시나리오' },
    { ic: '🤖', t: 'AI 1인칭 체험', d: 'Gemini가 사고 4단계\n선택지·피드백' },
    { ic: '📖', t: '약관 퀴즈 5문항', d: '보장범위/제외사유/장해등급\n4개 이상 정답 시 이수' },
    { ic: '📜', t: '이수증 + 단체가입', d: '학과 이수율 도달 시\n공제 가입 트리거' },
  ];

  steps.forEach((st, i) => {
    const x = 0.6 + i * 3.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 3.0, w: 2.85, h: 3.5,
      fill: { color: C.white }, line: { color: C.border, width: 1 }, rectRadius: 0.15,
      shadow: { type: 'outer', color: '000000', blur: 8, offset: 2, angle: 90, opacity: 0.06 },
    });
    // 아이콘 원
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.85, y: 3.25, w: 1.15, h: 1.15,
      fill: { color: C.redLight }, line: { color: C.redLight, width: 0 },
    });
    s.addText(st.ic, {
      x: x + 0.85, y: 3.25, w: 1.15, h: 1.15,
      fontSize: 36, align: 'center', valign: 'middle', margin: 0,
    });
    s.addText(`STEP ${i + 1}`, {
      x: x + 0.2, y: 4.55, w: 2.5, h: 0.3,
      fontSize: 10, fontFace: FONT_HEAD, color: C.red, bold: true, align: 'center', charSpacing: 3,
    });
    s.addText(st.t, {
      x: x + 0.2, y: 4.85, w: 2.5, h: 0.5,
      fontSize: 17, fontFace: FONT_HEAD, color: C.ink, bold: true, align: 'center', margin: 0,
    });
    s.addText(st.d, {
      x: x + 0.2, y: 5.4, w: 2.5, h: 1.1,
      fontSize: 11, fontFace: FONT_BODY, color: C.sub, align: 'center', margin: 0,
    });
    // 화살표
    if (i < steps.length - 1) {
      s.addText('→', {
        x: x + 2.85, y: 4.55, w: 0.25, h: 0.5,
        fontSize: 22, color: C.red, bold: true, align: 'center', valign: 'middle', margin: 0,
      });
    }
  });
}

// ─────────────────────────────────────────────
// 4. 차별점 — 법정 의무공제
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: '1A0000' };

  // 우측 빨간 패널
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.5, y: 0, w: 5.8, h: 7.5,
    fill: { color: C.red }, line: { color: C.red, width: 0 },
  });

  s.addText('DIFFERENTIATOR', {
    x: 0.6, y: 0.6, w: 6, h: 0.4,
    fontSize: 12, fontFace: FONT_HEAD, color: C.red, bold: true, charSpacing: 6,
  });

  s.addText([
    { text: '임의 보험이 아니라\n', options: { color: C.white } },
    { text: '법정 의무공제', options: { color: C.red } },
    { text: ' 위에', options: { color: C.white } },
  ], {
    x: 0.6, y: 1.05, w: 7, h: 2.0,
    fontSize: 36, fontFace: FONT_HEAD, bold: true, margin: 0,
  });

  // 법령 인용 카드
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 3.4, w: 6.7, h: 3.4,
    fill: { color: '2A0A0A' }, line: { color: C.red, width: 1 }, rectRadius: 0.15,
  });

  s.addText('근거 법령', {
    x: 0.85, y: 3.6, w: 6, h: 0.35,
    fontSize: 11, fontFace: FONT_HEAD, color: C.red, bold: true, charSpacing: 4,
  });

  s.addText('「연구실 안전환경 조성에 관한 법률」 제26조', {
    x: 0.85, y: 3.95, w: 6.2, h: 0.5,
    fontSize: 18, fontFace: FONT_HEAD, color: C.white, bold: true, margin: 0,
  });

  s.addText([
    { text: '"연구주체의 장은 연구활동종사자의 사고에 대비하여 ', options: { color: 'CCCCCC' } },
    { text: '보험에 가입하여야 한다', options: { color: C.white, bold: true } },
    { text: '"', options: { color: 'CCCCCC' } },
  ], {
    x: 0.85, y: 4.55, w: 6.2, h: 1.0,
    fontSize: 13, fontFace: FONT_BODY, italic: true, margin: 0,
  });

  s.addText('→ 모든 공대 학과는 「연구실안전공제」 의무 가입 대상', {
    x: 0.85, y: 5.55, w: 6.2, h: 0.4,
    fontSize: 13, fontFace: FONT_BODY, color: C.white,
  });

  s.addText('→ SafeLab은 이 위에 「교육 + 단체가입 + 사고대응」 부가가치 레이어', {
    x: 0.85, y: 5.95, w: 6.2, h: 0.4,
    fontSize: 13, fontFace: FONT_BODY, color: C.white,
  });

  s.addText('→ 학교는 실효성, 보험사는 손해율 절감 — 양쪽 동기 일치', {
    x: 0.85, y: 6.35, w: 6.2, h: 0.4,
    fontSize: 13, fontFace: FONT_BODY, color: C.white,
  });

  // 우측 빨간 패널 컨텐츠
  s.addText('운영기관', {
    x: 7.8, y: 1.0, w: 5.2, h: 0.4,
    fontSize: 12, fontFace: FONT_HEAD, color: C.white, bold: true, charSpacing: 4,
  });

  s.addText('한국교육시설안전원', {
    x: 7.8, y: 1.4, w: 5.2, h: 0.6,
    fontSize: 22, fontFace: FONT_HEAD, color: C.white, bold: true, margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.8, y: 2.15, w: 0.6, h: 0.06, fill: { color: C.white }, line: { color: C.white, width: 0 },
  });

  // 핵심 사실 5개
  const facts = [
    { k: '계약자', v: '연구주체의 장 (학과/학교)' },
    { k: '피공제자', v: '연구활동종사자 (학생·연구원)' },
    { k: '단체 가입', v: '학과 전체인원 → 신입생 자동 담보' },
    { k: '보장 항목', v: '요양·장해·유족·장의·입원급여' },
    { k: '특약', v: '등록금 손실 / 화상 / 간병' },
  ];

  facts.forEach((f, i) => {
    const y = 2.45 + i * 0.85;
    s.addText(f.k, {
      x: 7.8, y, w: 5.2, h: 0.3,
      fontSize: 10, fontFace: FONT_HEAD, color: 'FFE5E5', bold: true, charSpacing: 3,
    });
    s.addText(f.v, {
      x: 7.8, y: y + 0.3, w: 5.2, h: 0.45,
      fontSize: 14, fontFace: FONT_BODY, color: C.white, bold: true, margin: 0,
    });
  });

  s.addText('SafeLab · 인슈어테크', {
    x: 0.6, y: 7.15, w: 6, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: '888888',
  });
  s.addText('4 / ' + TOTAL, {
    x: 12.0, y: 7.15, w: 1.0, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: 'FFB3B3', align: 'right',
  });
}

// ─────────────────────────────────────────────
// 5. 시스템 구조
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addChrome(s, 5, TOTAL);

  s.addText('SYSTEM ARCHITECTURE', {
    x: 0.6, y: 0.5, w: 6, h: 0.4,
    fontSize: 12, fontFace: FONT_HEAD, color: C.red, bold: true, charSpacing: 6,
  });

  s.addText('진입 흐름 — 관리자 / 학생 분기', {
    x: 0.6, y: 0.95, w: 12, h: 0.7,
    fontSize: 32, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
  });

  // 중앙 EntryPage 박스
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.4, y: 2.3, w: 2.5, h: 1.2,
    fill: { color: C.red }, line: { color: C.red, width: 0 }, rectRadius: 0.12,
  });
  s.addText('EntryPage', {
    x: 5.4, y: 2.4, w: 2.5, h: 0.5,
    fontSize: 18, fontFace: FONT_HEAD, color: C.white, bold: true,
    align: 'center', valign: 'middle', margin: 0,
  });
  s.addText('route /', {
    x: 5.4, y: 2.85, w: 2.5, h: 0.5,
    fontSize: 11, fontFace: FONT_BODY, color: 'FFCCCC',
    align: 'center', valign: 'middle', margin: 0,
  });

  // 관리자 라인
  s.addShape(pres.shapes.LINE, {
    x: 5.4, y: 2.9, w: -1.5, h: 0.9, line: { color: C.red, width: 2 },
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 1.0, y: 3.9, w: 3.5, h: 2.6,
    fill: { color: C.white }, line: { color: C.border, width: 1 }, rectRadius: 0.12,
    shadow: { type: 'outer', color: '000000', blur: 8, offset: 2, angle: 90, opacity: 0.06 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 1.0, y: 3.9, w: 3.5, h: 0.08,
    fill: { color: C.red }, line: { color: C.red, width: 0 },
  });
  s.addText('🧑‍💼 관리자', {
    x: 1.2, y: 4.05, w: 3.1, h: 0.5,
    fontSize: 18, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
  });
  s.addText([
    { text: '/admin/login', options: { fontSize: 11, color: C.red, bold: true, breakLine: true } },
    { text: '└ admin / admin1234', options: { fontSize: 11, color: C.sub, breakLine: true } },
    { text: ' ', options: { fontSize: 6, breakLine: true } },
    { text: '/admin', options: { fontSize: 11, color: C.red, bold: true, breakLine: true } },
    { text: '└ KPI · 학과 이수율', options: { fontSize: 11, color: C.sub, breakLine: true } },
    { text: '└ 사고 분포 · 미이수자', options: { fontSize: 11, color: C.sub } },
  ], {
    x: 1.2, y: 4.6, w: 3.1, h: 1.8,
    fontFace: FONT_BODY, margin: 0,
  });

  // 학생 라인
  s.addShape(pres.shapes.LINE, {
    x: 7.9, y: 2.9, w: 1.5, h: 0.9, line: { color: C.red, width: 2 },
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 8.8, y: 3.9, w: 3.5, h: 2.6,
    fill: { color: C.white }, line: { color: C.border, width: 1 }, rectRadius: 0.12,
    shadow: { type: 'outer', color: '000000', blur: 8, offset: 2, angle: 90, opacity: 0.06 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 8.8, y: 3.9, w: 3.5, h: 0.08,
    fill: { color: C.red }, line: { color: C.red, width: 0 },
  });
  s.addText('🎓 학생', {
    x: 9.0, y: 4.05, w: 3.1, h: 0.5,
    fontSize: 18, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
  });
  s.addText([
    { text: '/student/department', options: { fontSize: 11, color: C.red, bold: true, breakLine: true } },
    { text: '└ 학과 4개 + 학번/이름', options: { fontSize: 11, color: C.sub, breakLine: true } },
    { text: ' ', options: { fontSize: 6, breakLine: true } },
    { text: '/safety/:dept/scenario → quiz', options: { fontSize: 11, color: C.red, bold: true, breakLine: true } },
    { text: '└ AI 시나리오 → 퀴즈', options: { fontSize: 11, color: C.sub, breakLine: true } },
    { text: '└ 이수증', options: { fontSize: 11, color: C.sub } },
  ], {
    x: 9.0, y: 4.6, w: 3.1, h: 1.8,
    fontFace: FONT_BODY, margin: 0,
  });

  // 긴급 분리
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 4.0, y: 6.7, w: 5.3, h: 0.55,
    fill: { color: C.redLight }, line: { color: C.red, width: 1 }, rectRadius: 0.1,
  });
  s.addText([
    { text: '🚨  ', options: { fontSize: 14 } },
    { text: '긴급 FAB → /emergency  ', options: { fontSize: 13, color: C.red, bold: true } },
    { text: '· 보험과 분리', options: { fontSize: 11, color: C.sub } },
  ], {
    x: 4.0, y: 6.7, w: 5.3, h: 0.55,
    fontFace: FONT_BODY, align: 'center', valign: 'middle', margin: 0,
  });
}

// ─────────────────────────────────────────────
// 6. 학생 흐름 데모
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addChrome(s, 6, TOTAL);

  s.addText('STUDENT FLOW', {
    x: 0.6, y: 0.5, w: 5, h: 0.4,
    fontSize: 12, fontFace: FONT_HEAD, color: C.red, bold: true, charSpacing: 6,
  });
  s.addText('학생 화면 — 진입부터 이수증까지', {
    x: 0.6, y: 0.95, w: 12, h: 0.7,
    fontSize: 30, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
  });

  // 5개 phone 모형
  const phones = [
    { t: '진입', sub: '관리자/학생\n분기', body: ['🛡️ SafeLab', ' ', '🎓 학생으로 진입', '🧑‍💼 관리자로 진입', ' ', '🚨 긴급 연락처'] },
    { t: '학과 선택', sub: '학과별\n맞춤화', body: ['이름·학번 입력', ' ', '🧪 화공환경과', '⚙️ 기계과', '⚡ 전기정보과', '💻 컴퓨터정보과'] },
    { t: 'AI 시나리오', sub: '1인칭 4단계', body: ['1/4 사고 발생', '"황산이 손등에…"', 'A 실험 마무리', 'B 즉시 세척 ✓', 'C 연고'] },
    { t: '약관 퀴즈', sub: '5문항 4↑', body: ['Q1. 보상되는?', 'Q2. 통지의무?', 'Q3. 등급?', '4 / 5 ✓', '이수 완료'] },
    { t: '이수증', sub: '인쇄/PDF', body: ['안전교육 이수증', '이름 ○○○', '학과 화공환경과', '발급 IHC-CHEM-2026', '🖨️ 인쇄'] },
  ];

  phones.forEach((p, i) => {
    const x = 0.7 + i * 2.55;
    // phone outer
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.85, w: 2.35, h: 4.4,
      fill: { color: '1A1A1A' }, line: { color: '1A1A1A', width: 0 }, rectRadius: 0.2,
    });
    // screen
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.1, y: 2.0, w: 2.15, h: 4.1,
      fill: { color: C.white }, line: { color: C.white, width: 0 }, rectRadius: 0.15,
    });
    // header bar (red)
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.1, y: 2.0, w: 2.15, h: 0.55,
      fill: { color: C.red }, line: { color: C.red, width: 0 },
    });
    s.addText(`STEP ${i + 1}`, {
      x: x + 0.1, y: 2.05, w: 2.15, h: 0.25,
      fontSize: 8, fontFace: FONT_HEAD, color: C.white, align: 'center', charSpacing: 2,
    });
    s.addText(p.t, {
      x: x + 0.1, y: 2.25, w: 2.15, h: 0.3,
      fontSize: 12, fontFace: FONT_HEAD, color: C.white, bold: true, align: 'center', margin: 0,
    });
    // body items
    const bodyText = p.body.map((b, bi) => ({
      text: b,
      options: { fontSize: 9, color: C.ink, breakLine: bi !== p.body.length - 1, bold: bi === 1 || (b.includes('✓')) },
    }));
    s.addText(bodyText, {
      x: x + 0.2, y: 2.7, w: 1.95, h: 3.0,
      fontFace: FONT_BODY, margin: 0,
    });
    // caption below
    s.addText(p.sub, {
      x, y: 6.4, w: 2.35, h: 0.5,
      fontSize: 11, fontFace: FONT_BODY, color: C.sub, align: 'center', italic: true, margin: 0,
    });

    // arrow between phones
    if (i < phones.length - 1) {
      s.addText('▶', {
        x: x + 2.35, y: 3.85, w: 0.2, h: 0.4,
        fontSize: 14, color: C.red, bold: true, align: 'center', valign: 'middle', margin: 0,
      });
    }
  });
}

// ─────────────────────────────────────────────
// 7. AI 시나리오 + 약관 컨텍스트
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addChrome(s, 7, TOTAL);

  s.addText('AI INSIDE', {
    x: 0.6, y: 0.5, w: 5, h: 0.4,
    fontSize: 12, fontFace: FONT_HEAD, color: C.red, bold: true, charSpacing: 6,
  });
  s.addText('Gemini가 약관을 보고 시나리오를 만든다', {
    x: 0.6, y: 0.95, w: 12, h: 0.7,
    fontSize: 28, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
  });

  // 좌측: 약관 컨텍스트 카드
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 2.0, w: 5.3, h: 4.7,
    fill: { color: C.cream }, line: { color: C.redLight, width: 1 }, rectRadius: 0.15,
  });
  s.addText('📖 약관 컨텍스트 주입', {
    x: 0.85, y: 2.2, w: 5, h: 0.4,
    fontSize: 14, fontFace: FONT_HEAD, color: C.red, bold: true,
  });
  s.addText([
    { text: '제3조 보상하는 손해', options: { fontSize: 13, color: C.ink, bold: true, breakLine: true } },
    { text: '연구활동 중 상해·질병 — 과실 무관 보상', options: { fontSize: 11, color: C.sub, breakLine: true } },
    { text: '유독가스 흡입·중독 포함', options: { fontSize: 11, color: C.sub, breakLine: true } },
    { text: ' ', options: { fontSize: 7, breakLine: true } },
    { text: '제10조 보상하지 않는 손해', options: { fontSize: 13, color: C.ink, bold: true, breakLine: true } },
    { text: '고의·자해·범죄, 임신·출산·전쟁 등', options: { fontSize: 11, color: C.sub, breakLine: true } },
    { text: ' ', options: { fontSize: 7, breakLine: true } },
    { text: '제11조 통지 의무', options: { fontSize: 13, color: C.ink, bold: true, breakLine: true } },
    { text: '사고 인지 즉시 안전원 통지', options: { fontSize: 11, color: C.sub, breakLine: true } },
    { text: ' ', options: { fontSize: 7, breakLine: true } },
    { text: '별표1 후유장해 14급', options: { fontSize: 13, color: C.ink, bold: true, breakLine: true } },
    { text: '1급 2억원 ~ 14급 차등 — 절단·시력·청력·신경계', options: { fontSize: 11, color: C.sub, breakLine: true } },
    { text: ' ', options: { fontSize: 7, breakLine: true } },
    { text: '단체계약 특약', options: { fontSize: 13, color: C.ink, bold: true, breakLine: true } },
    { text: '학과 전체 가입 → 신입생 자동 담보', options: { fontSize: 11, color: C.sub, breakLine: true } },
    { text: ' ', options: { fontSize: 7, breakLine: true } },
    { text: '특약 — 등록금 손실 / 화상 / 간병', options: { fontSize: 13, color: C.ink, bold: true, breakLine: true } },
    { text: '15일↑ 입원 시 100만원, 화상 40~100%', options: { fontSize: 11, color: C.sub } },
  ], {
    x: 0.85, y: 2.55, w: 5, h: 4.1, fontFace: FONT_BODY, margin: 0,
  });

  // 화살표
  s.addText('→', {
    x: 5.95, y: 4.1, w: 0.6, h: 0.6,
    fontSize: 36, color: C.red, bold: true, align: 'center', valign: 'middle', margin: 0,
  });

  // 우측: 생성 결과 (시나리오 1단계 모형)
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.7, y: 2.0, w: 6.0, h: 4.7,
    fill: { color: C.white }, line: { color: C.border, width: 1 }, rectRadius: 0.15,
    shadow: { type: 'outer', color: '000000', blur: 8, offset: 2, angle: 90, opacity: 0.06 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.7, y: 2.0, w: 6.0, h: 0.45,
    fill: { color: C.red }, line: { color: C.red, width: 0 },
  });
  s.addText('🤖 Gemini 생성 — 강산 피부 접촉', {
    x: 6.85, y: 2.05, w: 5.7, h: 0.35,
    fontSize: 11, fontFace: FONT_HEAD, color: C.white, bold: true, margin: 0, valign: 'middle',
  });
  // phase pill
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.95, y: 2.65, w: 1.4, h: 0.35,
    fill: { color: C.redLight }, line: { color: C.redLight, width: 0 }, rectRadius: 0.1,
  });
  s.addText('사고 발생', {
    x: 6.95, y: 2.65, w: 1.4, h: 0.35,
    fontSize: 10, fontFace: FONT_HEAD, color: C.red, bold: true, align: 'center', valign: 'middle', margin: 0,
  });
  s.addText('"황산이 손등에 한 방울 튀었습니다.\n손등이 따끔거리고 빨갛게 변하기 시작합니다."', {
    x: 6.95, y: 3.15, w: 5.6, h: 0.85,
    fontSize: 12, fontFace: FONT_BODY, color: C.ink, italic: true, margin: 0,
  });
  s.addText('Q. 가장 먼저 해야 할 행동은?', {
    x: 6.95, y: 4.05, w: 5.6, h: 0.4,
    fontSize: 12, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
  });
  // choices
  const choices = [
    { l: 'A', t: '실험을 마저 끝낸다', ok: false },
    { l: 'B', t: '15분 이상 흐르는 물에 세척', ok: true },
    { l: 'C', t: '연고를 바른다', ok: false },
  ];
  choices.forEach((c, i) => {
    const y = 4.55 + i * 0.55;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 6.95, y, w: 5.6, h: 0.45,
      fill: { color: c.ok ? C.greenLight : C.white }, line: { color: c.ok ? C.green : C.border, width: 1 }, rectRadius: 0.08,
    });
    s.addText(`${c.l}.   ${c.t}`, {
      x: 7.1, y, w: 4.8, h: 0.45,
      fontSize: 11, fontFace: FONT_BODY, color: C.ink, valign: 'middle', margin: 0, bold: c.ok,
    });
    if (c.ok) {
      s.addText('✓', {
        x: 12.0, y, w: 0.5, h: 0.45,
        fontSize: 14, color: C.green, bold: true, align: 'center', valign: 'middle', margin: 0,
      });
    }
  });
}

// ─────────────────────────────────────────────
// 8. 학과별 컨텐츠
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addChrome(s, 8, TOTAL);

  s.addText('CONTENT BY DEPARTMENT', {
    x: 0.6, y: 0.5, w: 6, h: 0.4,
    fontSize: 12, fontFace: FONT_HEAD, color: C.red, bold: true, charSpacing: 6,
  });
  s.addText('학과별 시나리오 — 약관 보장 항목과 1:1 매핑', {
    x: 0.6, y: 0.95, w: 12, h: 0.7,
    fontSize: 26, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
  });

  const depts = [
    { ic: '🧪', name: '화공환경과', tags: ['화상', '중독', '누출'],
      sc: ['황산 피부 접촉 사고', '유독가스 누출 (드래프트 고장)'],
      cl: '제3조 ② 유독가스 흡입 중독 + 화상 특약' },
    { ic: '⚙️', name: '기계과', tags: ['끼임', '절단', '안구'],
      sc: ['선반 작업 중 옷자락 끼임', '그라인더 파편 안구 비산'],
      cl: '별표1 1~3급 (상지 절단·시력 상실)' },
    { ic: '⚡', name: '전기정보과', tags: ['감전', '화재', '아크'],
      sc: ['배전반 작업 중 감전', '분전반 합선 화재'],
      cl: '별표1 신경계 장해 + 중대 화상 특약' },
    { ic: '💻', name: '컴퓨터정보과', tags: ['화재', '응급'],
      sc: ['서버실 UPS 발열 화재', '밤샘 작업 중 의식 저하'],
      cl: '제3조 보상 + 화상 특약' },
  ];

  depts.forEach((d, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 6.2;
    const y = 1.85 + row * 2.55;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 6.0, h: 2.35,
      fill: { color: C.white }, line: { color: C.border, width: 1 }, rectRadius: 0.15,
      shadow: { type: 'outer', color: '000000', blur: 8, offset: 2, angle: 90, opacity: 0.05 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.12, h: 2.35,
      fill: { color: C.red }, line: { color: C.red, width: 0 },
    });
    // 아이콘 원
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.35, y: y + 0.3, w: 0.85, h: 0.85,
      fill: { color: C.redLight }, line: { color: C.redLight, width: 0 },
    });
    s.addText(d.ic, {
      x: x + 0.35, y: y + 0.3, w: 0.85, h: 0.85,
      fontSize: 28, align: 'center', valign: 'middle', margin: 0,
    });
    s.addText(d.name, {
      x: x + 1.35, y: y + 0.3, w: 4.5, h: 0.45,
      fontSize: 18, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
    });
    // tags
    s.addText(d.tags.map(t => `#${t}`).join('  '), {
      x: x + 1.35, y: y + 0.75, w: 4.5, h: 0.3,
      fontSize: 10, fontFace: FONT_BODY, color: C.red, bold: true, margin: 0,
    });
    // scenarios
    s.addText([
      { text: '시나리오\n', options: { fontSize: 9, color: C.sub, charSpacing: 2, bold: true } },
      { text: `① ${d.sc[0]}\n`, options: { fontSize: 12, color: C.ink, bold: true } },
      { text: `② ${d.sc[1]}`, options: { fontSize: 12, color: C.ink, bold: true } },
    ], {
      x: x + 0.4, y: y + 1.25, w: 5.5, h: 0.7, fontFace: FONT_BODY, margin: 0,
    });
    // clause
    s.addText(`📖 ${d.cl}`, {
      x: x + 0.4, y: y + 1.95, w: 5.5, h: 0.3,
      fontSize: 10, fontFace: FONT_BODY, color: C.sub, italic: true, margin: 0,
    });
  });
}

// ─────────────────────────────────────────────
// 9. 관리자 대시보드
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addChrome(s, 9, TOTAL);

  s.addText('ADMIN DASHBOARD', {
    x: 0.6, y: 0.5, w: 6, h: 0.4,
    fontSize: 12, fontFace: FONT_HEAD, color: C.red, bold: true, charSpacing: 6,
  });
  s.addText('관리자 — 이수 현황 + 안전 대시보드', {
    x: 0.6, y: 0.95, w: 12, h: 0.7,
    fontSize: 28, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
  });

  // KPI 4개
  const kpis = [
    { l: '전체 이수율', v: '68%', sub: '378 / 412명', c: C.red },
    { l: '미이수자', v: '121', sub: '개별 추적 가능', c: '#F59E0B' },
    { l: '완료 시나리오', v: '1,284', sub: '학기 누적', c: C.red },
    { l: '7일 사고신고', v: '3건', sub: '안전원 통지 완료', c: C.red },
  ];
  kpis.forEach((k, i) => {
    const x = 0.6 + i * 3.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.9, w: 2.95, h: 1.5,
      fill: { color: C.white }, line: { color: C.border, width: 1 }, rectRadius: 0.12,
      shadow: { type: 'outer', color: '000000', blur: 6, offset: 2, angle: 90, opacity: 0.05 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.9, w: 2.95, h: 0.07,
      fill: { color: k.c }, line: { color: k.c, width: 0 },
    });
    s.addText(k.l, {
      x: x + 0.2, y: 2.05, w: 2.6, h: 0.3,
      fontSize: 10, fontFace: FONT_HEAD, color: C.sub, bold: true, charSpacing: 2,
    });
    s.addText(k.v, {
      x: x + 0.2, y: 2.4, w: 2.6, h: 0.7,
      fontSize: 36, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
    });
    s.addText(k.sub, {
      x: x + 0.2, y: 3.1, w: 2.6, h: 0.25,
      fontSize: 10, fontFace: FONT_BODY, color: C.sub, margin: 0,
    });
  });

  // 학과별 진척률 좌측
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 3.65, w: 6.1, h: 3.2,
    fill: { color: C.white }, line: { color: C.border, width: 1 }, rectRadius: 0.12,
  });
  s.addText('학과별 이수 현황', {
    x: 0.85, y: 3.85, w: 5.5, h: 0.4,
    fontSize: 14, fontFace: FONT_HEAD, color: C.ink, bold: true,
  });

  const dprog = [
    { n: '화공환경과', r: 76, h: false },
    { n: '기계과',     r: 60, h: true },
    { n: '전기정보과', r: 73, h: false },
    { n: '컴퓨터정보과', r: 65, h: false },
  ];
  dprog.forEach((d, i) => {
    const y = 4.35 + i * 0.55;
    s.addText(d.n, {
      x: 0.85, y, w: 1.7, h: 0.3,
      fontSize: 11, fontFace: FONT_BODY, color: C.ink, bold: true, margin: 0,
    });
    // bar bg
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 2.6, y: y + 0.05, w: 3.2, h: 0.2,
      fill: { color: 'F3F4F6' }, line: { color: 'F3F4F6', width: 0 }, rectRadius: 0.1,
    });
    // bar fill
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 2.6, y: y + 0.05, w: 3.2 * (d.r / 100), h: 0.2,
      fill: { color: d.h ? C.red : C.redDark }, line: { color: C.red, width: 0 }, rectRadius: 0.1,
    });
    s.addText(`${d.r}%`, {
      x: 5.9, y, w: 0.6, h: 0.3,
      fontSize: 11, fontFace: FONT_HEAD, color: d.h ? C.red : C.ink, bold: true, margin: 0,
    });
  });
  s.addText('⚠ 기계과 이수율 60% — 마감 D-18 안내메일 발송 권장', {
    x: 0.85, y: 6.45, w: 5.7, h: 0.3,
    fontSize: 10, fontFace: FONT_BODY, color: C.red, italic: true, margin: 0,
  });

  // 사고 분포 우측
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.9, y: 3.65, w: 5.8, h: 3.2,
    fill: { color: C.white }, line: { color: C.border, width: 1 }, rectRadius: 0.12,
  });
  s.addText('사고 유형 분포 (학기 누적 18건)', {
    x: 7.15, y: 3.85, w: 5.4, h: 0.4,
    fontSize: 14, fontFace: FONT_HEAD, color: C.ink, bold: true,
  });

  const acc = [
    { t: '화상', c: 7, col: C.red },
    { t: '외상/절단', c: 5, col: '#F59E0B' },
    { t: '중독/흡입', c: 3, col: '#8B5CF6' },
    { t: '감전', c: 2, col: '#3B82F6' },
    { t: '기타', c: 1, col: '#6B7280' },
  ];
  const total = acc.reduce((a, b) => a + b.c, 0);
  let xCur = 7.15;
  const w0 = 5.4;
  acc.forEach((a) => {
    const w = w0 * (a.c / total);
    s.addShape(pres.shapes.RECTANGLE, {
      x: xCur, y: 4.4, w, h: 0.45,
      fill: { color: a.col }, line: { color: a.col, width: 0 },
    });
    xCur += w;
  });
  // legend
  acc.forEach((a, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 7.15 + col * 2.7;
    const y = 5.1 + row * 0.45;
    s.addShape(pres.shapes.OVAL, {
      x, y: y + 0.05, w: 0.18, h: 0.18,
      fill: { color: a.col }, line: { color: a.col, width: 0 },
    });
    s.addText(`${a.t}`, {
      x: x + 0.3, y, w: 1.5, h: 0.3,
      fontSize: 11, fontFace: FONT_BODY, color: C.sub, margin: 0,
    });
    s.addText(`${a.c}건`, {
      x: x + 1.6, y, w: 0.6, h: 0.3,
      fontSize: 11, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
    });
  });
}

// ─────────────────────────────────────────────
// 10. 긴급 기능 분리
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addChrome(s, 10, TOTAL);

  s.addText('EMERGENCY · DECOUPLED', {
    x: 0.6, y: 0.5, w: 6, h: 0.4,
    fontSize: 12, fontFace: FONT_HEAD, color: C.red, bold: true, charSpacing: 6,
  });
  s.addText([
    { text: '긴급 ≠ 보험\n', options: { color: C.ink } },
    { text: '먼저 사람을 구하고, 보험은 나중', options: { color: C.red } },
  ], {
    x: 0.6, y: 0.95, w: 12, h: 1.5,
    fontSize: 30, fontFace: FONT_HEAD, bold: true, margin: 0,
  });

  // 좌측: 기존
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 2.7, w: 5.8, h: 4.0,
    fill: { color: 'F3F4F6' }, line: { color: 'D1D5DB', width: 1 }, rectRadius: 0.15,
  });
  s.addText('이전 안전교육의 문제', {
    x: 0.85, y: 2.9, w: 5.4, h: 0.4,
    fontSize: 13, fontFace: FONT_HEAD, color: C.sub, bold: true, charSpacing: 2,
  });
  // 4개 항목을 균등 배치 (카드 내부 y: 3.4 ~ 6.5, 약 0.78 간격)
  const oldProb = [
    '사고 발생 시 누구에게? 어떻게?',
    '보험 청구 페이지로 직결 → 골든타임 낭비',
    '학과별 안전관리자 연락처 따로 찾아야',
    '약관상 통지의무(즉시) 모르고 지나침',
  ];
  oldProb.forEach((p, i) => {
    const y = 3.45 + i * 0.78;
    s.addShape(pres.shapes.OVAL, {
      x: 0.95, y: y + 0.1, w: 0.32, h: 0.32,
      fill: { color: C.redLight }, line: { color: C.redLight, width: 0 },
    });
    s.addText('×', {
      x: 0.95, y: y + 0.1, w: 0.32, h: 0.32,
      fontSize: 16, color: C.red, bold: true, align: 'center', valign: 'middle', margin: 0,
    });
    s.addText(p, {
      x: 1.4, y, w: 4.85, h: 0.55,
      fontSize: 14, fontFace: FONT_BODY, color: C.ink, bold: true, valign: 'middle', margin: 0,
    });
  });

  // 우측: SafeLab 방식
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.9, y: 2.7, w: 5.8, h: 4.0,
    fill: { color: C.white }, line: { color: C.red, width: 2 }, rectRadius: 0.15,
    shadow: { type: 'outer', color: '000000', blur: 10, offset: 3, angle: 90, opacity: 0.08 },
  });
  s.addText('SafeLab 방식', {
    x: 7.15, y: 2.9, w: 5.4, h: 0.4,
    fontSize: 13, fontFace: FONT_HEAD, color: C.red, bold: true, charSpacing: 2,
  });

  const items = [
    { ic: '🚨', t: '전역 빨강 FAB 어디서나', d: '학생/관리자 모든 화면 우하단 1탭 진입' },
    { ic: '📞', t: '학과별 + 공통 연락처', d: '119 → 학과 안전관리자 → 안전원 순' },
    { ic: '⚖️', t: '약관 통지의무 명시', d: '"제11조 즉시 통지" 배너 상단 고정' },
    { ic: '🔀', t: '보험은 분리된 별도 모듈', d: '/insurance/* 로 격리, 응급 흐름 방해 X' },
  ];
  items.forEach((it, i) => {
    const y = 3.4 + i * 0.78;
    s.addText(it.ic, {
      x: 7.15, y, w: 0.5, h: 0.5, fontSize: 22, valign: 'middle', margin: 0,
    });
    s.addText(it.t, {
      x: 7.7, y, w: 4.85, h: 0.35,
      fontSize: 13, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
    });
    s.addText(it.d, {
      x: 7.7, y: y + 0.32, w: 4.85, h: 0.35,
      fontSize: 11, fontFace: FONT_BODY, color: C.sub, margin: 0,
    });
  });
}

// ─────────────────────────────────────────────
// 11. 디자인 — Vodafone 풍 빨강+화이트
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addChrome(s, 11, TOTAL);

  s.addText('DESIGN SYSTEM', {
    x: 0.6, y: 0.5, w: 6, h: 0.4,
    fontSize: 12, fontFace: FONT_HEAD, color: C.red, bold: true, charSpacing: 6,
  });
  s.addText('빨강 + 화이트 모바일 카드 톤', {
    x: 0.6, y: 0.95, w: 12, h: 0.7,
    fontSize: 28, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
  });

  // 좌측: 색상 토큰
  const tokens = [
    { c: C.red,        l: '#E60000', n: 'Primary' },
    { c: C.redDark,    l: '#B30000', n: 'Primary Dark' },
    { c: C.redLight,   l: '#FFE5E5', n: 'Primary Light' },
    { c: C.bg,         l: '#F5F5F7', n: 'Background', dark: true },
    { c: C.ink,        l: '#1A1A1A', n: 'Text' },
    { c: C.sub,        l: '#6B7280', n: 'Sub Text' },
  ];
  tokens.forEach((t, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 3.0;
    const y = 1.95 + row * 1.5;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 2.85, h: 1.35,
      fill: { color: C.white }, line: { color: C.border, width: 1 }, rectRadius: 0.1,
    });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.2, y: y + 0.2, w: 0.95, h: 0.95,
      fill: { color: t.c }, line: { color: t.dark ? C.border : t.c, width: t.dark ? 1 : 0 }, rectRadius: 0.08,
    });
    s.addText(t.n, {
      x: x + 1.3, y: y + 0.25, w: 1.5, h: 0.4,
      fontSize: 13, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
    });
    s.addText(t.l, {
      x: x + 1.3, y: y + 0.65, w: 1.5, h: 0.4,
      fontSize: 11, fontFace: FONT_BODY, color: C.sub, margin: 0,
    });
  });

  // 우측: 모바일 모형
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 7.5, y: 1.95, w: 5.2, h: 5.0,
    fill: { color: '0A0A0A' }, line: { color: '0A0A0A', width: 0 }, rectRadius: 0.25,
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 7.65, y: 2.1, w: 4.9, h: 4.7,
    fill: { color: C.bg }, line: { color: C.bg, width: 0 }, rectRadius: 0.18,
  });
  // 빨간 헤더
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.65, y: 2.1, w: 4.9, h: 1.6,
    fill: { color: C.red }, line: { color: C.red, width: 0 },
  });
  s.addText('SafeLab', {
    x: 7.85, y: 2.4, w: 4.5, h: 0.5,
    fontSize: 22, fontFace: FONT_HEAD, color: C.white, bold: true, margin: 0,
  });
  s.addText('인하공전 연구실 안전', {
    x: 7.85, y: 2.95, w: 4.5, h: 0.35,
    fontSize: 11, fontFace: FONT_BODY, color: 'FFCCCC', margin: 0,
  });
  // 카드들
  const cards = [
    { t: '🎓 학생으로 진입', s: '학과별 안전교육' },
    { t: '🧑‍💼 관리자로 진입', s: '이수 현황·대시보드' },
    { t: '🚨 긴급 연락처', s: '학과별 + 119', primary: true },
  ];
  cards.forEach((c, i) => {
    const y = 3.8 + i * 0.85;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 7.85, y, w: 4.5, h: 0.7,
      fill: { color: C.white }, line: { color: c.primary ? C.red : C.border, width: c.primary ? 2 : 1 }, rectRadius: 0.1,
    });
    s.addText(c.t, {
      x: 8.0, y, w: 3.2, h: 0.35,
      fontSize: 11, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0, valign: 'middle',
    });
    s.addText(c.s, {
      x: 8.0, y: y + 0.32, w: 3.2, h: 0.35,
      fontSize: 9, fontFace: FONT_BODY, color: C.sub, margin: 0,
    });
    s.addText('→', {
      x: 11.7, y, w: 0.5, h: 0.7,
      fontSize: 14, color: C.red, bold: true, align: 'center', valign: 'middle', margin: 0,
    });
  });
  s.addText('Vodafone 풍 카드 + 한국형 안전 빨강', {
    x: 7.5, y: 7.1, w: 5.2, h: 0.3,
    fontSize: 10, fontFace: FONT_BODY, color: C.sub, italic: true, align: 'center',
  });
}

// ─────────────────────────────────────────────
// 12. 기술 스택 + 1주 데모 일정
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addChrome(s, 12, TOTAL);

  s.addText('TECH STACK · TIMELINE', {
    x: 0.6, y: 0.5, w: 6, h: 0.4,
    fontSize: 12, fontFace: FONT_HEAD, color: C.red, bold: true, charSpacing: 6,
  });
  s.addText('1주 안에 만든 데모 — 아키텍처 + 일정', {
    x: 0.6, y: 0.95, w: 12, h: 0.7,
    fontSize: 28, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
  });

  // 좌측: 기술 스택
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 2.0, w: 6.0, h: 4.7,
    fill: { color: C.white }, line: { color: C.border, width: 1 }, rectRadius: 0.15,
  });
  s.addText('🛠️ Tech Stack', {
    x: 0.85, y: 2.2, w: 5.5, h: 0.4,
    fontSize: 14, fontFace: FONT_HEAD, color: C.red, bold: true,
  });
  const stacks = [
    { l: 'Frontend', v: 'React 18 · React Router v6 · Axios' },
    { l: 'AI', v: 'Google Gemini 1.5 Flash (mock fallback)' },
    { l: 'Backend', v: 'Spring Boot 3 · Spring Security · JPA · H2' },
    { l: 'Style', v: 'CSS Variables · 모바일 우선 480px' },
    { l: '데이터 소스', v: '「연구실안전공제」 약관 PDF (42p)' },
    { l: '재사용 인프라', v: 'Help 룰엔진 · Mail 모듈' },
  ];
  stacks.forEach((st, i) => {
    const y = 2.75 + i * 0.62;
    s.addText(st.l, {
      x: 0.85, y, w: 1.5, h: 0.3,
      fontSize: 10, fontFace: FONT_HEAD, color: C.sub, bold: true, charSpacing: 2,
    });
    s.addText(st.v, {
      x: 0.85, y: y + 0.27, w: 5.5, h: 0.3,
      fontSize: 13, fontFace: FONT_BODY, color: C.ink, bold: true, margin: 0,
    });
  });

  // 우측: 7일 일정
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.9, y: 2.0, w: 6.0, h: 4.7,
    fill: { color: C.white }, line: { color: C.border, width: 1 }, rectRadius: 0.15,
  });
  s.addText('📅 1주 일정 (D1~D7)', {
    x: 7.15, y: 2.2, w: 5.5, h: 0.4,
    fontSize: 14, fontFace: FONT_HEAD, color: C.red, bold: true,
  });
  const days = [
    { d: 'D1', t: '디자인 토큰 + 진입/긴급', done: true },
    { d: 'D2', t: '학과 선택 + 안전교육 메인', done: true },
    { d: 'D3', t: 'AI 시나리오 (Gemini + mock)', done: true },
    { d: 'D4', t: '약관 퀴즈 + 이수증', done: true },
    { d: 'D5', t: '관리자 대시보드 + 백엔드 API', done: true },
    { d: 'D6', t: '백엔드 연동 + 통합 테스트', done: true },
    { d: 'D7', t: '발표자료·시연 리허설', done: false },
  ];
  days.forEach((dy, i) => {
    const y = 2.75 + i * 0.55;
    s.addShape(pres.shapes.OVAL, {
      x: 7.15, y: y + 0.05, w: 0.3, h: 0.3,
      fill: { color: dy.done ? C.red : 'F3F4F6' }, line: { color: dy.done ? C.red : C.border, width: 1 },
    });
    s.addText(dy.done ? '✓' : '·', {
      x: 7.15, y: y + 0.05, w: 0.3, h: 0.3,
      fontSize: 12, color: dy.done ? C.white : C.sub, bold: true, align: 'center', valign: 'middle', margin: 0,
    });
    s.addText(dy.d, {
      x: 7.6, y, w: 0.6, h: 0.4,
      fontSize: 13, fontFace: FONT_HEAD, color: C.red, bold: true, margin: 0,
    });
    s.addText(dy.t, {
      x: 8.25, y, w: 4.5, h: 0.4,
      fontSize: 13, fontFace: FONT_BODY, color: dy.done ? C.ink : C.sub, bold: dy.done, margin: 0,
    });
  });
}

// ─────────────────────────────────────────────
// 13. 마무리
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.red };

  // 큰 인용
  s.addText('SAFELAB', {
    x: 0.6, y: 0.7, w: 12, h: 0.5,
    fontSize: 14, fontFace: FONT_HEAD, color: 'FFB3B3', bold: true, charSpacing: 8,
  });

  s.addText([
    { text: '실험실 안전을\n', options: { color: C.white } },
    { text: '학과의 일상으로.', options: { color: C.white } },
  ], {
    x: 0.6, y: 1.3, w: 12, h: 2.6,
    fontSize: 64, fontFace: FONT_HEAD, bold: true, margin: 0,
  });

  // 핵심 3가지
  const core = [
    { n: '01', t: '법정 의무공제 위 부가가치', d: '「연구실안전공제」 약관과 1:1 매핑' },
    { n: '02', t: 'AI 시나리오로 실효성 회복', d: '학과별 1인칭 체험 + 약관 퀴즈' },
    { n: '03', t: '학과 단위 단체가입 연계', d: '이수율 도달 시 자동 가입 트리거' },
  ];
  core.forEach((c, i) => {
    const x = 0.6 + i * 4.15;
    // 흰색 카드 (red text) — 대비 명확하게
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 4.2, w: 3.95, h: 1.95,
      fill: { color: C.white }, line: { color: C.white, width: 0 }, rectRadius: 0.12,
      shadow: { type: 'outer', color: '000000', blur: 12, offset: 4, angle: 90, opacity: 0.18 },
    });
    s.addText(c.n, {
      x: x + 0.3, y: 4.4, w: 1, h: 0.5,
      fontSize: 26, fontFace: FONT_HEAD, color: C.red, bold: true, margin: 0,
    });
    s.addText(c.t, {
      x: x + 0.3, y: 4.95, w: 3.4, h: 0.45,
      fontSize: 16, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0,
    });
    s.addText(c.d, {
      x: x + 0.3, y: 5.45, w: 3.4, h: 0.65,
      fontSize: 12, fontFace: FONT_BODY, color: C.sub, margin: 0,
    });
  });

  // 팀 정보
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 6.55, w: 0.8, h: 0.06, fill: { color: C.white }, line: { color: C.white, width: 0 },
  });
  s.addText([
    { text: '팀 인슈어테크 · 이예진 · 지윤석', options: { fontSize: 13, color: C.white, bold: true, breakLine: true } },
    { text: '인하공업전문대학 · 2026 학교 경진대회', options: { fontSize: 11, color: 'FFE5E5' } },
  ], {
    x: 0.6, y: 6.7, w: 8, h: 0.7, fontFace: FONT_BODY, margin: 0,
  });

  s.addText('Q & A', {
    x: 9.5, y: 6.7, w: 3.5, h: 0.7,
    fontSize: 28, fontFace: FONT_HEAD, color: C.white, bold: true, align: 'right', charSpacing: 4, margin: 0,
  });
}

// 저장
const outPath = 'C:/Users/user/OneDrive - 인하공업전문대학/바탕 화면/itc2026/팀플/이예진지윤석/SafeLab_발표자료.pptx';
pres.writeFile({ fileName: outPath })
  .then(() => console.log(`✓ Saved: ${outPath}`))
  .catch((e) => { console.error('FAILED:', e); process.exit(1); });

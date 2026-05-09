// 연구실안전공제 — RAG 시드 데이터
// 출처: .claude/labsafety_pact_fitz.txt (한국교육시설안전원 「연구실안전공제」 약관/보상기준)
// 법적 근거: 「연구실 안전환경 조성에 관한 법률」제26조 (보험가입 등)
//
// 이 모듈은 화면 카피·더미 시나리오·RAG 인용에 모두 사용되는 단일 소스입니다.
// 풀 약관 텍스트는 .claude/labsafety_pact_fitz.txt 에 보존되어 있고,
// 백엔드 RAG 파이프라인에서 임베딩 인덱스로 사용할 수 있습니다.

export const PRODUCT = {
  name: '연구실안전공제',
  enName: 'Lab Safety Mutual Aid',
  legalBase: '「연구실 안전환경 조성에 관한 법률」 제26조',
  insurer: '한국교육시설안전원',
};

export const PARTIES = {
  contractor: '연구주체의 장',           // 대학·연구기관 등
  insured: '연구활동종사자',              // 교수·연구원·학생
  beneficiary: '수익자',                 // 공제급여를 청구·수령
};

// 공제급여 종류 (제3장 보상기준)
export const BENEFITS = [
  { key: 'medical',  name: '요양급여', desc: '치료에 필요한 의료비 지급 (진찰·검사·약제·처치·수술·재활·입원·간병)' },
  { key: 'disability', name: '장해급여', desc: '후유장해 등급별 보상금 지급 (별표1)' },
  { key: 'survivors', name: '유족급여', desc: '사망 시 공제가입금액 전액을 유족에게 지급' },
  { key: 'hospitalization', name: '입원급여', desc: '입원 1일당 최저 5만 원 (입원일수 3일 초과분부터)' },
  { key: 'funeral', name: '장의비', desc: '유족급여 지급 시 가입증서 기재 금액 지급' },
];

// 보상하는 손해 (제3조 + 보상기준 제3장에 따른 대표 사고 시나리오)
export const SCENARIOS = [
  {
    id: 'chemical',
    title: '화학약품 노출',
    summary: '유독가스 또는 유독물질을 우연하게 일시 흡입·흡수·섭취하여 발생한 중독증상',
    examples: ['시약 흄 흡입', '강산·강염기 피부 접촉', '용매 증기 중독'],
    coveredBenefits: ['medical', 'disability', 'hospitalization'],
    citation: '제3조 제2항',
  },
  {
    id: 'mechanical',
    title: '기계·장비 부상',
    summary: '연구활동 중 회전체·날·압축기 등 기계장치에 의한 절단·골절·압박상',
    examples: ['선반 작업 중 손가락 절단', '원심분리기 끼임', '프레스 압착'],
    coveredBenefits: ['medical', 'disability', 'survivors'],
    citation: '제3조 제1항',
  },
  {
    id: 'electric',
    title: '전기 감전',
    summary: '실험 장비·전기설비 작업 중 감전 사고',
    examples: ['고전압 장비 점검 중 감전', '누전 회로 접촉'],
    coveredBenefits: ['medical', 'disability', 'hospitalization'],
    citation: '제3조 제1항',
  },
  {
    id: 'fire',
    title: '화재·폭발',
    summary: '시약 반응·전기 합선·가스 누출에 의한 화재 및 폭발',
    examples: ['리튬 시약 발화', '배터리 충전 중 폭발', '흄 후드 내 화재'],
    coveredBenefits: ['medical', 'disability', 'survivors', 'funeral'],
    citation: '제3조 제1항',
  },
  {
    id: 'fall',
    title: '추락·낙상',
    summary: '실험대·계단·고소작업·기자재 운반 중 추락',
    examples: ['고소 장비 점검 추락', '계단 미끄러짐', '실험대 위 작업 낙상'],
    coveredBenefits: ['medical', 'disability', 'hospitalization'],
    citation: '제3조 제1항',
  },
];

// 면책 (제10조 등에서 발췌 — 보상하지 않는 손해의 대표 항목)
export const EXCLUSIONS = [
  '피공제자의 고의로 인한 손해',
  '수익자의 고의 (단, 일부 수익자에 한함)',
  '이미 가지고 있던 질병',
  '임신·출산·유산·외과적 수술 (상해로 인한 경우 제외)',
  '세균성 음식물 중독',
];

// 더미 상담 기록 (MainPage 초기화용) — 모두 연구실 사고 시나리오 기반
export const SAMPLE_CONSULT_HISTORY = [
  {
    roomId: 'demo-chem-001',
    title: '연구실안전공제 — 화학약품 노출 상담',
    date: '2026. 5. 6. 오전 10:21',
    keywords: ['화학약품', '요양급여', '제3조'],
  },
  {
    roomId: 'demo-mech-002',
    title: '연구실안전공제 — 원심분리기 끼임 사고',
    date: '2026. 5. 3. 오후 3:48',
    keywords: ['기계 부상', '장해급여', '청구'],
  },
  {
    roomId: 'demo-elec-003',
    title: '연구실안전공제 — 전기 감전 입원 청구',
    date: '2026. 4. 28. 오전 9:05',
    keywords: ['감전', '입원급여', '5만원'],
  },
  {
    roomId: 'demo-fire-004',
    title: '연구실안전공제 — 흄 후드 화재 보장 범위',
    date: '2026. 4. 20. 오후 2:14',
    keywords: ['화재', '유족급여', '장의비'],
  },
];

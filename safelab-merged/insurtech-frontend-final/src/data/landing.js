// 안전관리/안전교육 랜딩페이지의 모든 카피·데이터·라우트 단일 소스.
//
// to 필드 규칙 (SmartLink가 자동 분기):
//   '#anchor'  → 페이지 내 스크롤 (<a>)
//   '/route'   → React Router SPA 이동 (<Link>)
//   'http://'  → 외부 링크 (새 탭)
//
// Inner 앱 라우트 (src/App.js):
//   /                                     EntryPage (진입 분기)
//   /landing                              SafetyLandingPage (이 페이지)
//   /student/department                   DepartmentSelectPage (학과 선택)
//   /student/safety/:dept                 SafetyMainPage (학과별 안전교육 허브)
//   /student/safety/:dept/scenario/:sid   SafetyScenarioPage
//   /student/safety/:dept/quiz/:sid       SafetyQuizPage  ← 학과별 퀴즈
//   /student/safety/:dept/certificate     CertificatePage ← 이수증
//   /admin/login                          AdminLoginPage
//   /admin                                AdminDashboardPage (관리자 대시보드)
//   /emergency                            EmergencyPage (긴급 연락)
//   /insurance/consult                    DeviceCheckPage (보험 상담 시작)
//   /insurance/room/:roomId               ConsultationRoomPage
//   /insurance/summary/:roomId            SummaryPage

export const BRAND = {
  name: 'SafeLab',
  enName: 'SAFELAB',
  tagline: 'Safer Lab, Safer Tomorrow',
  homeTo: '#hero',
};

export const HEADER_MENUS = [
  { label: '서비스 소개', to: '#about' },
  { label: '왜 SafeLab?', to: '#why-safelab' },
  { label: '라인업', to: '#lineup' },
  { label: '관리자', to: '/admin/login' },
];

export const HEADER_AUTH = [
  { label: '관리자 로그인', to: '/admin/login', variant: 'ghost' },
  { label: '학생 시작하기', to: '/student/department', variant: 'primary' },
];

export const HERO = {
  indicator: { current: '05', total: '12' },
  megaText: 'SAFE LAB',
  headline: '안전한 연구실,\n법정의무 연구실안전공제',
  subcopy:
    '연구실 안전교육 이수부터 「연구실 안전환경 조성에 관한 법률」 제26조 의무 가입까지 — SafeLab이 한국교육시설안전원 연구실안전공제를 한 번에 연결합니다.',
  ctaPrimary: { label: '학과별 안전교육 시작', to: '/student/department' },
  ctaSecondary: { label: '라인업 살펴보기', to: '#lineup' },
  // 이미지를 public/landing/safelab-hero.png 에 저장하면 자동 노출.
  // 파일이 없으면 그라디언트 + 아이콘 fallback이 사용됩니다.
  image: '/landing/safelab-hero.png',
  imageAlt: 'SafeLab 실험실 일러스트 — 후드, 아이워시, 비상 사이렌, 폐기물 분리',
};

export const ABOUT = {
  eyebrow: 'About',
  title: '왜 SafeLab인가',
  paragraphs: [
    '연구실 사고의 대부분은 예측 가능한 위험(화학약품·기계·감전·화재·추락)에서 발생합니다. SafeLab은 학과별 위험요소에 맞춘 법정의무 안전교육과 「연구실 안전환경 조성에 관한 법률」제26조 연구실안전공제를 하나의 흐름으로 연결합니다.',
    '학생(연구활동종사자)은 학과별 시나리오·퀴즈로 이수증을 발급받고, 관리자(연구주체의 장)는 대시보드에서 이수율·미이수자·사고 리포트를 한눈에 추적합니다. 사고 발생 시에는 공제급여(요양·장해·유족·입원·장의비) 청구로 즉시 이어집니다.',
    '본 데모는 「인하공업전문대학 2026 대학안전관리계획」(85페이지) 실제 데이터를 시드로 사용합니다 — 학생 7,068명, 건물 25개, 4종 보험 가입 현황 등.',
  ],
  tags: ['법정의무교육', '학과별 시나리오', '학과별 퀴즈', '이수증 발급', '연구실안전공제'],
  cards: [
    {
      title: '학과별 맞춤 커리큘럼',
      desc: '화공·기계·전기·바이오 등 학과 위험요소에 맞춘 시나리오와 퀴즈',
      icon: 'GraduationCap',
      tone: 'primary',
      to: '/student/department',
    },
    {
      title: '이수증 자동 발급',
      desc: '시나리오 + 퀴즈 통과 시 학생증 연동 이수증을 즉시 발급',
      icon: 'QrCode',
      tone: 'secondary',
      to: '/student/department',
    },
    {
      title: '리스크 모니터링',
      desc: '학과·연구실 단위 위험 등급, 이수율, 사고 리포트를 관리자 대시보드에서',
      icon: 'Gauge',
      tone: 'accent',
      to: '/admin/login',
    },
    {
      title: '긴급 대응 가이드',
      desc: '학과별 응급 연락처와 사고 발생 시 공제급여 청구 안내',
      icon: 'LifeBuoy',
      tone: 'primary',
      to: '/emergency',
    },
  ],
};

export const LINEUP = {
  eyebrow: 'Lineup',
  title: '세 가지 핵심 솔루션',
  subtitle: '학과별 안전교육 · 연구실안전공제 · 관리자 모니터링이 하나로 이어집니다.',
  items: [
    {
      key: 'safelab',
      name: 'SafeLab Education',
      desc: '학과 맞춤형 시나리오 + 퀴즈',
      detail: '화공·기계·전기·바이오 등 학과별 위험요소를 반영한 시나리오와 퀴즈로 이수증까지 한번에.',
      icon: 'BookOpenCheck',
      gradient: 'from-cyan-400 to-teal-600',
      pillBg: 'bg-cyan-50',
      pillText: 'text-cyan-700',
      to: '/student/department',
      ctaLabel: '학과 선택하고 시작',
      image: '/landing/safelab-dashboard.png',
      imageAlt: 'SafeLab 대시보드 UI 목업',
    },
    {
      key: 'campusguard',
      name: 'CampusGuard Mutual',
      desc: '연구실안전공제 상담·청구',
      detail: '「연구실 안전환경 조성에 관한 법률」제26조 의무 가입. 요양·장해·유족·입원·장의비 5종 보장 — Gemini AI 약관 분석 상담실.',
      icon: 'ShieldCheck',
      gradient: 'from-pink-400 to-rose-500',
      pillBg: 'bg-pink-50',
      pillText: 'text-pink-700',
      to: '/insurance/consult',
      ctaLabel: '공제 상담 시작',
    },
    {
      key: 'riskradar',
      name: 'RiskRadar Admin',
      desc: '관리자 대시보드 + 사고 리포트',
      detail: '학과·연구실 단위 위험 지표·이수율·미이수자·공제급여 청구 현황을 한 화면에서 추적.',
      icon: 'Activity',
      gradient: 'from-yellow-300 to-amber-500',
      pillBg: 'bg-yellow-50',
      pillText: 'text-yellow-700',
      to: '/admin/login',
      ctaLabel: '관리자 로그인',
    },
  ],
};

export const CONTACT = {
  eyebrow: 'Contact',
  title: '지금 도입 문의하세요',
  subtitle:
    '연구실안전공제 도입을 검토 중인 학과/연구기관 담당자분들을 위한 무료 컨설팅을 제공합니다. 영업일 기준 1일 이내 회신드립니다.',
  info: [
    { icon: 'Phone', label: '전화', value: '032-870-2114' },
    { icon: 'Mail', label: '이메일', value: 'hello@safelab.kr' },
    { icon: 'MapPin', label: '주소', value: '인천광역시 미추홀구 인하로 100, 인하공업전문대학' },
    { icon: 'MessageCircle', label: '카카오 채널', value: '@SafeLab' },
  ],
  submitLabel: '신청하기',
};

// 「왜 SafeLab?」 섹션 (E 패키지) — 인하공전 「2026 대학안전관리계획」 PDF 피해현황 인용.
// 발표 임팩트: "이건 진짜 우리 학교 매년 일어나는 일"
export const WHY_SAFELAB = {
  eyebrow: 'Why SafeLab',
  title: '인하공전에서 매년 일어나는 일',
  subtitle:
    '「인하공업전문대학 2026 대학안전관리계획」(85p) 실제 피해현황 — 5년 평균 기준. 출처: 학교 공식 문서.',
  source: '출처: 「인하공전 2026 대학안전관리계획」 (2026.2 발행)',
  stats: [
    {
      key: 'lab',
      figure: '연 1.2건',
      headline: '연구실 사고 부상자',
      detail: '2022~2025 평균 — 화학실험·기계실습 위주. 도구 사용 부주의·회전체 보호기 미사용이 주 원인.',
      source: 'PDF p.32',
      tone: 'rose',
    },
    {
      key: 'industrial',
      figure: '연 0.2건',
      headline: '산업재해 부상자',
      detail: '청소·시설관리·급식 등 현업업무 종사자 — 2025년 1건 발생.',
      source: 'PDF p.51',
      tone: 'amber',
    },
    {
      key: 'sex',
      figure: '연 0.6건',
      headline: '성희롱·성폭력 신고',
      detail: '학생상담인권센터 접수 — 2024 성폭력 1건, 2025 성희롱 1건.',
      source: 'PDF p.47',
      tone: 'pink',
    },
    {
      key: 'covid',
      figure: '379명',
      headline: '코로나19 누적 확진 (2022)',
      detail: '대학 내 누적 — 비대면·자가격리 학사 운영으로 학습 결손 발생.',
      source: 'PDF p.34',
      tone: 'violet',
    },
    {
      key: 'buildings',
      figure: '13/25',
      headline: '교육시설 안전인증 완료',
      detail: '본관·1~7호관·11호관·생활관 등 13개 동 인증. 11호관·생활관 2026년 내진평가 예정.',
      source: 'PDF p.30',
      tone: 'mint',
    },
    {
      key: 'insurance',
      figure: '4종',
      headline: '학생 단체 가입 보험(공제)',
      detail: '대학배상책임 / 교육시설안전 / 연구실안전 / 신입생 OT — 7,068명 보호. 연 1,714만원 보험료.',
      source: 'PDF p.68',
      tone: 'sky',
    },
  ],
};

export const FOOTER = {
  brand: 'SafeLab',
  description: '연구실 안전교육과 연구실안전공제를 잇는 캠퍼스 리스크 플랫폼 (인슈어테크 팀)',
  columns: [
    {
      title: '서비스',
      links: [
        { label: '서비스 소개', to: '#about' },
        { label: '라인업', to: '#lineup' },
        { label: '도입 문의', to: '#contact' },
      ],
    },
    {
      title: '바로가기',
      links: [
        { label: '학생 시작하기', to: '/student/department' },
        { label: '보험 상담', to: '/insurance/consult' },
        { label: '관리자 로그인', to: '/admin/login' },
        { label: '긴급 연락처', to: '/emergency' },
      ],
    },
  ],
  socials: [
    { icon: 'Instagram', label: 'Instagram', to: 'https://instagram.com' },
    { icon: 'Youtube', label: 'YouTube', to: 'https://youtube.com' },
    { icon: 'MessageCircle', label: 'KakaoTalk', to: '#contact' },
  ],
  copyright: '© 2026 SafeLab — 인슈어테크 팀, 인하공업전문대학 경진대회 출품.',
};

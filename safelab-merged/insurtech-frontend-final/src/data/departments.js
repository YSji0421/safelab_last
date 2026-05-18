// 학과별 안전교육 컨텐츠 + 학과 전용 긴급연락처
// 시연용 4개 학과. 실제 사고 사례는 「연구실안전공제」 보장 항목과 매핑.

export const DEPARTMENTS = {
  chem: {
    id: 'chem',
    name: '화공환경과',
    shortName: '화공',
    icon: '🧪',
    accent: '#EC4899',
    riskTags: ['화상', '중독', '화학물질 누출'],
    desc: '강산·유독가스·고온 반응. 흡입·피부 노출 위험 높음.',
    scenarios: [
      {
        id: 'chem-1',
        title: '강산(황산) 피부 접촉 사고',
        difficulty: '중',
        tags: ['화상', '응급세척'],
        summary: '실험 중 황산이 손등에 튀었습니다. 다음 60초 안의 행동을 시뮬레이션합니다.',
        relatedClause: '약관 제3조(보상하는 손해), 별표1 후유장해등급',
        caseRef: 'case-4', // PDF 사례 4 — 시약병 화상
      },
      {
        id: 'chem-2',
        title: '유독가스 누출 — 후드 고장',
        difficulty: '상',
        tags: ['중독', '흡입'],
        summary: '드래프트 챔버가 멈춘 채로 염소가스가 누출되기 시작했습니다.',
        relatedClause: '약관 제3조 ② 유독가스 흡입 중독 포함',
        caseRef: 'case-9', // PDF 사례 9 — 가스 누출 폭발 (사망)
      },
      {
        id: 'chem-3',
        title: 'Sodium azide 폭발 — 플라스크 비산',
        difficulty: '상',
        tags: ['폭발', 'MSDS', '안면부 부상'],
        summary: 'Sodium azide(아지드염)을 할로겐화합물로 치환하는 실험 중, 중간생성물 계량 과정에서 마찰·충격으로 폭발이 발생했습니다.',
        relatedClause: '약관 제3조, 별표1 — MSDS 미숙지 + 보안경 미착용',
        caseRef: 'case-2', // PDF 사례 2
      },
    ],
    emergencyContacts: [
      { label: '학사지원팀 백일균 팀장', phone: '032-870-2030', desc: '연구실사고 주관부서 (PDF p.31)' },
      { label: '학사지원팀 곽경수', phone: '032-870-2036', desc: '연구실 안전 실무 담당' },
      { label: '인하대병원 응급실', phone: '032-890-2301', desc: '화상·중독 응급의료 (캠퍼스 인근)' },
      { label: '학생상담인권센터 김자경 센터장', phone: '032-870-2012', desc: '성희롱·성폭력 신고 (전 학과 공통)' },
    ],
  },
  mech: {
    id: 'mech',
    name: '기계과',
    shortName: '기계',
    icon: '⚙️',
    accent: '#F59E0B',
    riskTags: ['끼임', '절단', '낙하'],
    desc: '선반·밀링·그라인더 등 회전 공작기계. 끼임·절단 위험.',
    scenarios: [
      {
        id: 'mech-1',
        title: '선반 작업 중 옷자락 끼임',
        difficulty: '상',
        tags: ['끼임', '절단', '회전부'],
        summary: '선반 회전 중 작업복 소매가 척에 빨려 들어가는 상황입니다. PDF 안전수칙: 면장갑 착용 제한, 옷소매 단정, 회전 중 칩 제거 금지.',
        relatedClause: '약관 별표1 1~3급 후유장해(상지 절단)',
        caseRef: 'case-7', // PDF 사례 7 — 드릴 면장갑 손가락 절단
      },
      {
        id: 'mech-2',
        title: '그라인더 파편 안구 비산',
        difficulty: '중',
        tags: ['안구', '외상', '보안경'],
        summary: '보안경 미착용 상태로 그라인더 작업 중 파편이 튀었습니다. PDF 안전수칙: 가공 작업 시 보안경 착용 + 칩 비산방지장치 설치.',
        relatedClause: '약관 별표1 1~3급(시력 상실)',
        caseRef: null,
      },
      {
        id: 'mech-3',
        title: '직물압착롤러에 손 물림 — 라텍스 장갑',
        difficulty: '상',
        tags: ['끼임', '회전부', '장갑'],
        summary: '학부생이 직물압착롤러로 난연재 코팅 실험 중, 라텍스 장갑이 두 실린더 표면 마찰에 빨려 들어가 오른손 다발성 골절·신경손상.',
        relatedClause: '약관 별표1 — 회전부 끼임 + 안전 방호장치 미설치',
        caseRef: 'case-8', // PDF 사례 8
      },
    ],
    emergencyContacts: [
      { label: '시설안전팀 곽세일 팀장', phone: '032-870-2410', desc: '산업재해·기계사고 주관부서 (PDF p.50)' },
      { label: '시설안전팀 박만식', phone: '032-870-2412', desc: '실습실 안전 실무' },
      { label: '인하대병원 응급실', phone: '032-890-2301', desc: '외상·절단 응급의료 (캠퍼스 인근)' },
      { label: '인천119특수구조단', phone: '032-870-3400', desc: '인명구조센터' },
    ],
  },
  elec: {
    id: 'elec',
    name: '전기정보과',
    shortName: '전기',
    icon: '⚡',
    accent: '#3B82F6',
    riskTags: ['감전', '전기화재', '아크'],
    desc: '고전압 실습·배전반·아크. 감전과 2차 낙하 위험.',
    scenarios: [
      {
        id: 'elec-1',
        title: '배전반 작업 중 감전',
        difficulty: '상',
        tags: ['감전', '낙하'],
        summary: '활선 차단을 확인하지 않고 배전반에 접촉하여 감전됐습니다. PDF 안전수칙: 누전차단기 월 1회 시험, 습기/물기 환경 접지 필수.',
        relatedClause: '약관 제3조, 별표1 신경계통 장해',
        caseRef: null,
      },
      {
        id: 'elec-2',
        title: '실습실 분전반 합선 화재',
        difficulty: '중',
        tags: ['화재', '연기흡입'],
        summary: '브레이커가 트립되며 분전반에서 불꽃과 연기가 올라옵니다. 즉시 전원 차단 + 119 신고.',
        relatedClause: '약관 제4장 중대한 화상치료 간접지원금',
        caseRef: 'case-5', // PDF 사례 5 — 모터 스파크 화재
      },
      {
        id: 'elec-3',
        title: '리튬 배터리 보관 화재',
        difficulty: '상',
        tags: ['화재', '배터리', 'MSDS'],
        summary: '실습실 리튬 배터리가 과충전 상태로 방치되어 발화. 단락·이단 적재·인화성 물질 접촉이 주 원인.',
        relatedClause: 'PDF p.45 배터리 안전수칙 11개 — 충전 50~60% 보관, 절연 매트',
        caseRef: 'case-6', // PDF 사례 6 — 모터 과열 화재 (인접 화재 사례)
      },
    ],
    emergencyContacts: [
      { label: '시설안전팀 이정준', phone: '032-870-2413', desc: '전기·시설안전 실무 (PDF p.9)' },
      { label: '시설안전팀 곽세일 팀장', phone: '032-870-2410', desc: '시설안전 총괄' },
      { label: '인천전기안전공사', phone: '032-290-7000', desc: '감전·정전 24시간 (PDF p.80)' },
      { label: '한국전력공사', phone: '123', desc: '정전 신고' },
    ],
  },
  comp: {
    id: 'comp',
    name: '컴퓨터시스템공학과',
    shortName: '컴공',
    icon: '💻',
    accent: '#8B5CF6',
    riskTags: ['VDT', '서버화재', '근골격'],
    desc: '장시간 모니터·서버 과열·정전기. 만성·화재 위험.',
    scenarios: [
      {
        id: 'comp-1',
        title: '서버실 UPS 발열 화재',
        difficulty: '중',
        tags: ['화재', '연기흡입'],
        summary: '서버실 UPS에서 타는 냄새가 나고 연기가 보입니다. 즉시 전원 차단 + 소화기 사용은 초기 5초만.',
        relatedClause: '약관 제4장 중대한 화상치료 간접지원금',
        caseRef: 'case-6',
      },
      {
        id: 'comp-2',
        title: '장시간 작업 후 의식 저하 — CPR 상황',
        difficulty: '하',
        tags: ['응급', '의식저하', 'CPR'],
        summary: '팀 프로젝트 밤샘 중 동료가 의식이 흐려졌습니다. 어깨 두드림 → 119 신고 → 흉부압박 30회 → 인공호흡 2회.',
        relatedClause: '약관 제3조 보상하는 손해 (연구활동 중 사고) / PDF p.47 CPR 5단계',
        caseRef: null,
      },
    ],
    emergencyContacts: [
      { label: '시설안전팀 유태형', phone: '032-870-2415', desc: '서버실·전기시설 안전 실무' },
      { label: '시설안전팀 이충구', phone: '032-870-2414', desc: '소방·화재 대응' },
      { label: '인하대병원 응급실', phone: '032-890-2301', desc: '응급의식저하·화상 (캠퍼스 인근)' },
      { label: '학생성공팀 김상균 팀장', phone: '032-870-2047', desc: '학생 복지·심리 지원' },
    ],
  },
};

export const DEPARTMENT_LIST = [
  DEPARTMENTS.comp,
  DEPARTMENTS.chem,
  DEPARTMENTS.mech,
  DEPARTMENTS.elec,
];

export const getDepartment = (id) => DEPARTMENTS[id] || null;

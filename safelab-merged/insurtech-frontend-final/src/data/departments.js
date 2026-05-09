// 학과별 안전교육 컨텐츠 + 학과 전용 긴급연락처
// 시연용 4개 학과. 실제 사고 사례는 「연구실안전공제」 보장 항목과 매핑.

export const DEPARTMENTS = {
  chem: {
    id: 'chem',
    name: '화공환경과',
    shortName: '화공',
    icon: '🧪',
    accent: '#E60000',
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
      },
      {
        id: 'chem-2',
        title: '유독가스 누출 — 후드 고장',
        difficulty: '상',
        tags: ['중독', '흡입'],
        summary: '드래프트 챔버가 멈춘 채로 염소가스가 누출되기 시작했습니다.',
        relatedClause: '약관 제3조 ② 유독가스 흡입 중독 포함',
      },
    ],
    emergencyContacts: [
      { label: '화공환경과 안전관리자', phone: '032-870-2401', desc: '화학물질 누출·중독 1차 대응' },
      { label: '화학실험실 책임교수', phone: '032-870-2410', desc: '실험 중 사고 보고' },
      { label: '인근 응급의료센터(인하대병원)', phone: '032-890-2114', desc: '화상·중독 응급실' },
    ],
  },
  mech: {
    id: 'mech',
    name: '기계과',
    shortName: '기계',
    icon: '⚙️',
    accent: '#E60000',
    riskTags: ['끼임', '절단', '낙하'],
    desc: '선반·밀링·그라인더 등 회전 공작기계. 끼임·절단 위험.',
    scenarios: [
      {
        id: 'mech-1',
        title: '선반 작업 중 옷자락 끼임',
        difficulty: '상',
        tags: ['끼임', '절단'],
        summary: '선반 회전 중 작업복 소매가 척에 빨려 들어가는 상황입니다.',
        relatedClause: '약관 별표1 1~3급 후유장해(상지 절단)',
      },
      {
        id: 'mech-2',
        title: '그라인더 파편 안구 비산',
        difficulty: '중',
        tags: ['안구', '외상'],
        summary: '보안경 미착용 상태로 그라인더 작업 중 파편이 튀었습니다.',
        relatedClause: '약관 별표1 1~3급(시력 상실)',
      },
    ],
    emergencyContacts: [
      { label: '기계과 안전관리자', phone: '032-870-2501', desc: '공작기계 사고 1차 대응' },
      { label: '기계실습실 책임교수', phone: '032-870-2510', desc: '실습 중 사고 보고' },
      { label: '인근 응급의료센터(인하대병원)', phone: '032-890-2114', desc: '외상·절단 응급실' },
    ],
  },
  elec: {
    id: 'elec',
    name: '전기정보과',
    shortName: '전기',
    icon: '⚡',
    accent: '#E60000',
    riskTags: ['감전', '전기화재', '아크'],
    desc: '고전압 실습·배전반·아크. 감전과 2차 낙하 위험.',
    scenarios: [
      {
        id: 'elec-1',
        title: '배전반 작업 중 감전',
        difficulty: '상',
        tags: ['감전', '낙하'],
        summary: '활선 차단을 확인하지 않고 배전반에 접촉하여 감전됐습니다.',
        relatedClause: '약관 제3조, 별표1 신경계통 장해',
      },
      {
        id: 'elec-2',
        title: '실습실 분전반 합선 화재',
        difficulty: '중',
        tags: ['화재', '연기흡입'],
        summary: '브레이커가 트립되며 분전반에서 불꽃과 연기가 올라옵니다.',
        relatedClause: '약관 제4장 중대한 화상치료 간접지원금',
      },
    ],
    emergencyContacts: [
      { label: '전기정보과 안전관리자', phone: '032-870-2601', desc: '감전·전기화재 1차 대응' },
      { label: '전력실습실 책임교수', phone: '032-870-2610', desc: '실습 중 사고 보고' },
      { label: '한국전기안전공사', phone: '1588-7500', desc: '감전·정전 24시간' },
    ],
  },
  comp: {
    id: 'comp',
    name: '컴퓨터정보과',
    shortName: '컴공',
    icon: '💻',
    accent: '#E60000',
    riskTags: ['VDT', '서버화재', '근골격'],
    desc: '장시간 모니터·서버 과열·정전기. 만성·화재 위험.',
    scenarios: [
      {
        id: 'comp-1',
        title: '서버실 UPS 발열 화재',
        difficulty: '중',
        tags: ['화재', '연기흡입'],
        summary: '서버실 UPS에서 타는 냄새가 나고 연기가 보입니다.',
        relatedClause: '약관 제4장 중대한 화상치료 간접지원금',
      },
      {
        id: 'comp-2',
        title: '장시간 작업 후 의식 저하 (저혈당/탈수)',
        difficulty: '하',
        tags: ['응급', '의식저하'],
        summary: '팀 프로젝트 밤샘 중 동료가 의식이 흐려졌습니다.',
        relatedClause: '약관 제3조 보상하는 손해 (연구활동 중 사고)',
      },
    ],
    emergencyContacts: [
      { label: '컴퓨터정보과 안전관리자', phone: '032-870-2701', desc: '서버실·실습실 사고 1차 대응' },
      { label: '실습실 책임교수', phone: '032-870-2710', desc: '실습 중 사고 보고' },
      { label: '인근 응급의료센터(인하대병원)', phone: '032-890-2114', desc: '응급의식저하·화상' },
    ],
  },
};

export const DEPARTMENT_LIST = Object.values(DEPARTMENTS);

export const getDepartment = (id) => DEPARTMENTS[id] || null;

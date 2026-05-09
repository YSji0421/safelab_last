// 인하공전 「2026 안전교육자료」 PDF p.49~58 실제 사고사례 10건.
// 학과·기계·화학·전기 전 분야 — 시나리오 페이지 / 사고사례 라이브러리에서 사용.

export const INCIDENT_CASES = [
  {
    id: 'case-1',
    no: 1,
    title: '동결절단기 내부 정리 중 칼날에 베임',
    icon: '🔪',
    category: '기계',
    deptTags: ['mech', 'chem'],
    severity: 'medium',
    location: '○○대학교 의과대학',
    summary:
      '동결절단기로 사체 인대를 절단 실험. 종료 후 내부 정리 중 오른쪽 제5수지가 칼날에 접촉.',
    causes: {
      direct: '실험 종료 후 절단기 고정구에 부착된 칼날을 즉시 제거하지 않은 상태에서 내부 청소를 실시.',
      indirect: ['안전수칙(방법 및 절차) 숙지 미흡', '실험기기에 대한 주의사항 및 표지판 부착 미흡'],
    },
    damages: {
      injury: '부상 1명 — 열상 (오른쪽 제5수지 신경 완전 절단)',
      property: '없음',
    },
    coverage: ['요양급여', '입원급여', '장해급여 (별표1)'],
    lessonKey: 'cleanup',
    lessons: [
      '실험 종료 → 즉시 칼날 제거 후 정리 시작',
      '실험기기에 "칼날 부착됨" 표지판 부착',
      '청소 시 기계 완전 정지 + 잔여 회전 확인',
    ],
  },
  {
    id: 'case-2',
    no: 2,
    title: 'Sodium azide 폭발 — 플라스크 파편 비산',
    icon: '💥',
    category: '화학',
    deptTags: ['chem'],
    severity: 'high',
    location: '○○대학교 화학과',
    summary:
      'Sodium azide(아지드염)을 할로겐화합물로 치환하는 실험 중, 중간생성물 계량을 위해 스푼으로 긁다가 마찰·충격으로 폭발.',
    causes: {
      direct: '반응기에서 만들어진 불안정한 아자이드화물을 계량하기 위해 분말 시약을 스푼으로 긁는 과정의 마찰·충격에 의한 폭발.',
      indirect: ['MSDS 미숙지로 인한 불안정 물질의 폭발', '화학물질 합성 실험 시 보안경/보안면 미착용'],
    },
    damages: {
      injury: '부상 1명 — 열상 (왼손 개방성 골절 + 안면부 부상)',
      property: '없음',
    },
    coverage: ['요양급여', '장해급여', '교내·외 치료비'],
    lessonKey: 'msds',
    lessons: [
      '불안정 물질 다루기 전 MSDS 항목 1·5·10 필수 숙지',
      '보안경 + 보안면 + 두꺼운 장갑 착용',
      '아자이드화물 등 충격 민감 물질은 반드시 후드 내에서 처리',
    ],
  },
  {
    id: 'case-3',
    no: 3,
    title: '플라스크 부주의로 인한 파열',
    icon: '🧪',
    category: '화학',
    deptTags: ['chem'],
    severity: 'low',
    location: '○○대학교 효소학실험실',
    summary:
      '실험실 내부 정리 중 실험대 앞쪽에 세워둔 유리 플라스크에 왼쪽 허벅지가 찔림.',
    causes: {
      direct: '유해·위험물질 취급 부주의',
      indirect: ['안전한 실험 방법 및 절차 미흡', '정리정돈 미흡'],
    },
    damages: {
      injury: '부상 1명 — 창상 (왼쪽 허벅지)',
      property: '유리 플라스크 파손',
    },
    coverage: ['요양급여'],
    lessonKey: 'tidy',
    lessons: [
      '유리 기구는 항상 보관함 또는 트레이에 안전하게 보관',
      '실험대 앞쪽에 깨지기 쉬운 기구 세워두지 않기',
      '정리정돈 — 점검표 일상점검 항목에 포함',
    ],
  },
  {
    id: 'case-4',
    no: 4,
    title: '시약병 취급 부주의 — 포름산 화상',
    icon: '🔥',
    category: '화학',
    deptTags: ['chem'],
    severity: 'medium',
    location: '○○대학교 약품자원식물학연구실',
    summary:
      '후드 내에서 포름산을 취급 중 시약병이 넘어져 보호장갑 윗부분에 화상.',
    causes: {
      direct: '유해·위험물질 취급 부주의',
      indirect: ['적정 안전보호구 미착용', '정리정돈 미흡'],
    },
    damages: {
      injury: '부상 1명 — 화상',
      property: '없음',
    },
    coverage: ['요양급여', '입원급여'],
    lessonKey: 'ppe',
    lessons: [
      '강산/유기산 취급 시 화학보호장갑 + 보안경 + 실험복',
      '시약병은 안정된 위치에 + 흘림 방지 트레이 사용',
      '오염 즉시 후드 내 아이워시·샤워 사용',
    ],
  },
  {
    id: 'case-5',
    no: 5,
    title: '모터 스파크에 의한 화재 — 메틸알코올',
    icon: '🔥',
    category: '전기·화학',
    deptTags: ['elec', 'mech'],
    severity: 'high',
    location: '○○대학교 냉동공조공학과 제어계측공학실험실',
    summary:
      '흑연 탈지 실험 중 메틸알코올로 세척 후 자동탈수기 사용. 정지 버튼을 누르는 순간 모터 스파크로 착화. 안면부·양손 화상.',
    causes: {
      direct: '탈수기 내부에 다량의 메틸알코올 증기가 체류 → 전원 버튼 누름 → 모터 스파크 발생 → 착화',
      indirect: ['MSDS 미숙지로 화재 발생', '실험기기의 사용 용도 및 적합성 판단 부족'],
    },
    damages: {
      injury: '부상 1명 — 안면부 및 양손 2도 화상, 왼쪽 귀 3도 화상',
      property: '탈수기 1대 소손',
    },
    coverage: ['요양급여', '입원급여', '중대 화상치료 간접지원금', '장해급여'],
    lessonKey: 'flammable',
    lessons: [
      '인화성 액체로 세척한 후 잔여 증기가 빠질 때까지 대기',
      '인화성 증기 환경에서 전기 기기 작동 금지 (스파크 위험)',
      '용제 세척 후에는 별도 건조 장치 사용 — 모터 직접 사용 금지',
    ],
  },
  {
    id: 'case-6',
    no: 6,
    title: '롤성형기 모터 과열로 인한 화재',
    icon: '🔥',
    category: '기계·전기',
    deptTags: ['mech', 'elec'],
    severity: 'high',
    location: '○○대학교 나노성형연구실',
    summary:
      '연구원 2명이 롤성형기로 실험을 위해 예열 진행 중 잠시 자리를 비운 사이 모터 과열로 추정되는 화재 발생.',
    causes: {
      direct: '별도 인증 절차를 거치지 않은 자체 제작 롤성형기의 모터 과열',
      indirect: ['실험 중 실험자 현장 이탈로 인한 초기 대응 지연', '연구책임자 관리감독 소홀'],
    },
    damages: {
      injury: '없음 (조기 발견)',
      property: '실험장비 등 소방서 추산 약 200만원',
    },
    coverage: ['시설안전공제 (화재 재물)', '대학배상책임'],
    lessonKey: 'attended',
    lessons: [
      '예열·가열 작업 중 절대 자리 이탈 금지',
      '자체 제작 기기는 반드시 안전 인증 후 사용',
      '연구실 화재 감지기 + 자동 차단 설비 점검',
    ],
  },
  {
    id: 'case-7',
    no: 7,
    title: '드릴 작업 중 손가락 절단 — 면장갑 착용',
    icon: '⚙️',
    category: '기계',
    deptTags: ['mech'],
    severity: 'high',
    location: '○○대학교 물리학과 광학 및 기계공작실',
    summary:
      '면장갑을 착용하고 탁상용 드릴로 구리 시편 천공 작업 중 왼손이 드릴 비트(7mm)에 밀리면서 협착됨.',
    causes: {
      direct: '면장갑을 착용한 상태에서 테이블에 가공물을 고정하지 않고 작업',
      indirect: ['안전수칙 숙지 미흡', '실험기기에 주의사항 표지판 미부착'],
    },
    damages: {
      injury: '부상 1명 — 왼손 약지 2마디 절단',
      property: '없음',
    },
    coverage: ['요양급여', '장해급여 (별표1 절단 등급)', '입원급여'],
    lessonKey: 'noglove',
    lessons: [
      '회전 공작기계 작업 시 면장갑·라텍스 장갑 절대 금지',
      '가공물은 반드시 테이블에 클램프로 고정',
      '드릴·선반·밀링 안전수칙 표지판 기기 옆 부착',
    ],
  },
  {
    id: 'case-8',
    no: 8,
    title: '직물압착롤러에 오른손 물림',
    icon: '⚙️',
    category: '기계',
    deptTags: ['mech'],
    severity: 'high',
    location: '○○대학교 섬유집합공정실습실',
    summary:
      '학부생이 직물압착롤러로 직물에 난연재 코팅 실험 중, 라텍스 장갑이 두 실린더 표면 마찰에 빨려 들어가 오른손이 롤러 물림점에 말림.',
    causes: {
      direct: '난연재가 신체에 노출되는 것을 방지하기 위해 착용한 라텍스 장갑이 두 실린더 표면 마찰을 일으키며 빨려 들어감',
      indirect: ['끼임을 방지하기 위한 안전 방호장치 미설치'],
    },
    damages: {
      injury: '부상 1명 — 오른손 다발성 골절 및 신경 손상',
      property: '없음',
    },
    coverage: ['요양급여', '입원급여', '장해급여'],
    lessonKey: 'guard',
    lessons: [
      '롤러·압착기 등에는 반드시 안전 방호 가드 설치',
      '회전부 근처 작업 시 장갑 착용 금지 (말림 위험)',
      '비상 정지 버튼 위치 사전 확인 + 손 닿는 거리에',
    ],
  },
  {
    id: 'case-9',
    no: 9,
    title: '실습실 가스 누출에 의한 폭발 — 사망',
    icon: '💀',
    category: '화학·가스',
    deptTags: ['chem'],
    severity: 'critical',
    location: '○○연구소',
    summary:
      '회분식 반응기에서 물을 용재로 하는 중합 실험 중, 드레인 라인을 통해 가연성 가스(1,3-부타디엔)와 인화성 액체가 누출되어 폭발.',
    causes: {
      direct: '반응기 하부 드레인 밸브를 열고 샘플 채취 후 밸브를 완전히 잠그지 않은 상태에서 드레인 노즐을 통해 반응 내용물 누출',
      indirect: ['드레인 밸브 잠금을 실험자가 미확인'],
    },
    damages: {
      injury: '사망 1명, 부상 1명 (후유장해)',
      property: '실험실 내 전소',
    },
    coverage: ['유족급여 2억', '장해급여 2억', '장의비', '시설안전공제'],
    lessonKey: 'valve',
    lessons: [
      '밸브 잠금 후 반드시 2인 교차 확인 (체크리스트)',
      '가연성 가스 사용 실험실에 가스 검지기 + 자동 차단 시스템 필수',
      '비상 시 119 + 가스안전공사 (043-750-1300) 즉시 통보',
    ],
  },
  {
    id: 'case-10',
    no: 10,
    title: '산화성 고체 충격에 의한 폭발',
    icon: '💥',
    category: '화학',
    deptTags: ['chem'],
    severity: 'high',
    location: '○○연구소',
    summary:
      '무기 나노복합체 제조를 위한 사전 준비 중 폭발. 사고 원인 물질은 질산칼륨·과염소산칼륨으로, 장기 보관으로 백색 분말이 괴상(덩어리)으로 변질됨. 막자/막자사발로 분쇄 중 충격 폭발.',
    causes: {
      direct: '괴상 형태의 실험물질에 충격을 가함',
      indirect: ['시약의 장기 보관으로 변질', 'MSDS 미숙지'],
    },
    damages: {
      injury: '중상 1명 — 손, 다리 부위 외상 및 화상',
      property: '약 700만원 (추정)',
    },
    coverage: ['요양급여', '입원급여', '장해급여', '중대 화상치료 간접지원금'],
    lessonKey: 'aging',
    lessons: [
      '시약 정기 점검 — 변질·괴상화 여부 확인',
      '산화성 물질은 충격·마찰 금지 — 분쇄 시 전용 장비',
      'MSDS 항목 7(취급/저장) + 10(안정성/반응성) 필수 숙지',
    ],
  },
];

export const CASE_CATEGORIES = ['전체', '기계', '화학', '전기·화학', '기계·전기', '화학·가스'];

export const SEVERITY_COLORS = {
  low: { label: '경상', tone: 'gray' },
  medium: { label: '중상', tone: 'orange' },
  high: { label: '중대', tone: 'red' },
  critical: { label: '사망/중대재해', tone: 'red' },
};

export const getCase = (id) => INCIDENT_CASES.find((c) => c.id === id);

export const getCasesForDept = (deptId) =>
  INCIDENT_CASES.filter((c) => c.deptTags.includes(deptId));

export const CASE_STATS = {
  total: INCIDENT_CASES.length,
  byCategory: INCIDENT_CASES.reduce((m, c) => {
    m[c.category] = (m[c.category] || 0) + 1;
    return m;
  }, {}),
  fatalities: INCIDENT_CASES.filter((c) => c.severity === 'critical').length,
  topLessons: [
    '면장갑·라텍스 장갑 회전부 절대 금지 (사례 7, 8)',
    'MSDS 미숙지 → 폭발/화재 (사례 2, 5, 10)',
    '실험 자리 이탈 금지 (사례 6)',
    '밸브 잠금 2인 확인 (사례 9 — 사망)',
  ],
};

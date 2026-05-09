// 인하공전 캠퍼스 건물 25개 — 「2026 대학안전관리계획」 PDF p.30 표 그대로.
// certified: 교육시설안전 인증 연도 (없으면 null = 인증 필요/대상 외)
// seismicScheduled: 내진성능평가 예정 연도 (없으면 null)
// usedBy: 학과 매핑 (학생들이 자주 사용하는 건물) — 학과별 가이드용

export const BUILDINGS = [
  { id: 'main', name: '본관', built: 1979, structure: '철근콘크리트조', floors: 5, area: 5530, certified: 2024, seismicScheduled: null, usedBy: [], note: '행정 본관' },
  { id: 'b1', name: '1호관', built: 1975, structure: '철근콘크리트조', floors: 6, area: 4551, certified: 2024, seismicScheduled: null, usedBy: ['comp', 'mech'] },
  { id: 'b2', name: '2호관', built: 1993, structure: '철근콘크리트조', floors: 5, area: 5876, certified: 2024, seismicScheduled: null, usedBy: ['elec'] },
  { id: 'b3', name: '3호관', built: 1996, structure: '철근콘크리트조', floors: 5, area: 6241, certified: 2024, seismicScheduled: null, usedBy: ['chem'] },
  { id: 'b4', name: '4호관', built: 2004, structure: '철근콘크리트조', floors: 7, area: 6927, certified: 2022, seismicScheduled: null, usedBy: ['mech'] },
  { id: 'b5', name: '5호관', built: 1998, structure: '철근콘크리트조', floors: 4, area: 7185, certified: 2024, seismicScheduled: null, usedBy: ['elec', 'comp'] },
  { id: 'b6', name: '6호관', built: 1958, structure: '철근콘크리트조', floors: 3, area: 3179, certified: 2024, seismicScheduled: null, usedBy: [], note: '캠퍼스 최고령 건물' },
  { id: 'b7', name: '7호관', built: 1973, structure: '철근콘크리트조', floors: 5, area: 4256, certified: 2024, seismicScheduled: null, usedBy: ['comp'] },
  { id: 'b8', name: '8호관', built: 1976, structure: '철근콘크리트조', floors: 3, area: 2747, certified: null, seismicScheduled: null, usedBy: [], note: '인증 미적용' },
  { id: 'b9', name: '9호관', built: 1970, structure: '조적조', floors: 1, area: 529, certified: null, seismicScheduled: null, usedBy: [], note: '인증 대상 외' },
  { id: 'b10', name: '목구조실습실(10호관)', built: 2001, structure: '철근콘크리트조', floors: 4, area: 2177, certified: null, seismicScheduled: null, usedBy: ['mech'], note: '실습 전용' },
  { id: 'b11', name: '기초실습관(11호관)', built: 2012, structure: '철근콘크리트조', floors: 6, area: 16141, certified: 2022, seismicScheduled: 2026, usedBy: ['chem', 'mech', 'elec', 'comp'], note: '공대 4학과 공용 — 캠퍼스 최대 면적' },
  { id: 'dorm', name: '생활관(기숙사)', built: 2017, structure: '철근콘크리트조', floors: 8, area: 11442, certified: 2024, seismicScheduled: 2026, usedBy: [], note: '재학생 기숙' },
  { id: 'aero-engine', name: '항공기관실습실', built: 1995, structure: '경량철골조', floors: 1, area: 315, certified: null, seismicScheduled: null, usedBy: ['mech'], note: '항공기 엔진 실습' },
  { id: 'aero-yard', name: '항공기실습장', built: 1995, structure: '경량철골조', floors: 1, area: 238, certified: null, seismicScheduled: null, usedBy: ['mech'] },
  { id: 'aero-frame', name: '항공기체실습실(83동)', built: 1994, structure: '철골조', floors: 1, area: 285, certified: null, seismicScheduled: null, usedBy: ['mech'] },
  { id: 'substation', name: '변전실', built: 2002, structure: '철골철근콘크리트조', floors: 1, area: 370, certified: null, seismicScheduled: null, usedBy: ['elec'], note: '전기 핵심 설비 — 위험구역' },
  { id: 'analchem', name: '분석화학실습실', built: 1994, structure: '경량철골조', floors: 1, area: 147, certified: null, seismicScheduled: null, usedBy: ['chem'], note: '화학실험 — 환기 필수' },
  { id: 'club1', name: '학회룸1', built: 1993, structure: '경량철골조', floors: 1, area: 144, certified: null, seismicScheduled: null, usedBy: [] },
  { id: 'club2', name: '학회룸2', built: 1993, structure: '경량철골조', floors: 1, area: 160, certified: null, seismicScheduled: null, usedBy: [] },
  { id: 'circle', name: '동아리동', built: 1997, structure: '조적조', floors: 1, area: 1210, certified: null, seismicScheduled: null, usedBy: [] },
  { id: 'fuel', name: '연료창고', built: 1962, structure: '조적조', floors: 1, area: 21, certified: null, seismicScheduled: null, usedBy: [] },
  { id: 'env', name: '환경관리실', built: 2001, structure: '경량철골조', floors: 1, area: 119, certified: null, seismicScheduled: null, usedBy: [] },
  { id: 'guard', name: '경비실', built: 2006, structure: '철근콘크리트조', floors: 1, area: 21, certified: null, seismicScheduled: null, usedBy: [] },
  { id: 'stage', name: '단상', built: 2006, structure: '철골철근콘크리트조', floors: 2, area: 120, certified: null, seismicScheduled: null, usedBy: [] },
];

// 안전등급 자동 산정 — 인증 여부·내진 평가·노후도(준공년도) 종합
// 'A': 인증 + 최근(2010 이후) / 'B': 인증 / 'C': 인증 미적용 + 노후
export function getSafetyGrade(b) {
  const age = 2026 - b.built;
  if (b.certified) {
    if (age <= 16 || b.seismicScheduled) return 'A';
    return 'B';
  }
  // 인증 없음
  if (age >= 50) return 'D';
  if (age >= 30) return 'C';
  return 'B';
}

export const GRADE_META = {
  A: { label: 'A 등급', desc: '교육시설안전 인증 + 최신/내진평가', tone: 'green' },
  B: { label: 'B 등급', desc: '교육시설안전 인증 또는 비교적 최근 건축', tone: 'blue' },
  C: { label: 'C 등급', desc: '인증 미적용 — 노후 30년 이상', tone: 'orange' },
  D: { label: 'D 등급', desc: '캠퍼스 최고령 — 사용 시 주의', tone: 'red' },
};

// 학과별 자주 사용하는 건물 빠르게 가져오기
export function getBuildingsByDept(deptId) {
  return BUILDINGS.filter((b) => b.usedBy.includes(deptId));
}

// 학과별 가장 가까운 응급실·구조 (PDF p.80 — 모든 캠퍼스 동일하게 인하대병원이 최단)
export const NEAREST_HOSPITAL = {
  name: '인하대병원 응급실',
  phone: '032-890-2301',
  desc: '캠퍼스에서 차량 5분 거리 — 외상·화상·중독 응급의료',
};

export const STATS = {
  total: BUILDINGS.length,
  certified: BUILDINGS.filter((b) => b.certified).length,
  seismicScheduled: BUILDINGS.filter((b) => b.seismicScheduled).length,
  oldest: Math.min(...BUILDINGS.map((b) => b.built)),
  newest: Math.max(...BUILDINGS.map((b) => b.built)),
  totalArea: BUILDINGS.reduce((sum, b) => sum + b.area, 0),
};

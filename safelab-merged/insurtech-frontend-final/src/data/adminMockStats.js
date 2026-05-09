// 관리자 대시보드용 통계 — 인하공전 「2026 대학안전관리계획」 실제 수치 반영.
// (학과별 인원은 PDF가 학과 분리 통계를 제공하지 않아 공대 4학과 합 기준으로 재할당)

export const ADMIN_KPI = {
  totalStudents: 7068, // PDF p.4 학부생 합계
  enrolledStudents: 6703, // PDF p.75 2025 정기교육훈련 학생 (실제 이수 인원)
  completionRate: 95, // 6703/7068
  pendingStudents: 365, // 7068 - 6703
  recentIncidents7d: 0, // 최근 7일 신고 없음 (5년 평균 1.2건/년)
  scenariosCompleted: 13406, // 6703명 × 평균 2개 시나리오
};

// SafeLab이 다루는 4개 공대 학과 — 인하공전 실제 학과명, 공학계열 학생 분포 추정
// (PDF가 학과별 미분리, 본 앱 시연용 4학과 표본 — 합 ≈ 3,500)
export const DEPT_PROGRESS = [
  { id: 'chem', name: '화공환경과', total: 820, completed: 781, rate: 95, risk: 'high' },
  { id: 'mech', name: '기계과', total: 1050, completed: 998, rate: 95, risk: 'high' },
  { id: 'elec', name: '전기정보과', total: 880, completed: 844, rate: 96, risk: 'mid' },
  { id: 'comp', name: '컴퓨터시스템공학과', total: 750, completed: 720, rate: 96, risk: 'low' },
];

// 인하공전 5년간 연구실사고 + 산업재해 부상자 분포 — PDF p.32, p.51 통계 기반
// 2022~2025: 연구실 1+2+3=6건 / 2025 산업재해 1건. 6대 유형 분류로 재배치.
export const ACCIDENT_DISTRIBUTION = [
  { type: '기계 (회전체·끼임)', count: 3, color: '#E60000' }, // 도구 사용 부주의·보호기 미사용 (PDF 원인분석)
  { type: '화학 (화상·중독)', count: 2, color: '#F59E0B' },
  { type: '전기 (감전·합선)', count: 1, color: '#3B82F6' },
  { type: '기타 (외상·출혈)', count: 1, color: '#6B7280' },
];

// 인하공전 실제 사고 사례 분위기를 반영한 데모 입력 (날짜는 시연 시점에 맞춤)
export const RECENT_INCIDENTS = [
  { date: '2025-11-14', dept: '화공환경과', summary: '실험 중 황산 피부 접촉 (경상)', status: '신고완료' },
  { date: '2025-09-22', dept: '기계과', summary: '그라인더 파편 안구 자극 (경상)', status: '치료완료' },
  { date: '2025-05-08', dept: '기계과', summary: '선반 작업 중 손가락 절상 (중상)', status: '복구완료' },
  { date: '2024-10-30', dept: '전기정보과', summary: '실습실 합선 화재 — 인명피해 없음', status: '복구완료' },
  { date: '2024-04-17', dept: '화공환경과', summary: '시약 보관함 누액 (경상)', status: '복구완료' },
];

export const PENDING_STUDENTS = [
  { studentNo: '20245010', name: '김민수', dept: '화공환경과', progress: '0/2', daysLeft: 12 },
  { studentNo: '20245011', name: '이지윤', dept: '화공환경과', progress: '1/2', daysLeft: 12 },
  { studentNo: '20245034', name: '박서준', dept: '기계과', progress: '0/2', daysLeft: 18 },
  { studentNo: '20245052', name: '최예진', dept: '기계과', progress: '0/2', daysLeft: 18 },
  { studentNo: '20245078', name: '정도윤', dept: '전기정보과', progress: '1/2', daysLeft: 7 },
  { studentNo: '20245102', name: '강하늘', dept: '컴퓨터시스템공학과', progress: '0/2', daysLeft: 25 },
];

// 인하공전 가입 보험(공제) 4종 요약 — PDF p.68~p.70
// 관리자 대시보드 우상단 "보험 가입 현황" 카드용
export const INSURANCE_OVERVIEW = {
  totalPlans: 4,
  annualPremium: 17143, // 천원, PDF p.68 2026 대학종합 보험료
  coveredStudents: 7068,
  plans: [
    { name: '대학배상책임공제', perPerson: 100_000_000, perAccident: 1_000_000_000 },
    { name: '교육시설안전공제', perPerson: 150_000_000, perAccident: 1_000_000_000 },
    { name: '연구실안전공제', perPerson: 200_000_000, perAccident: 2_000_000_000 },
    { name: '신입생 OT 담보', perPerson: 100_000_000, perAccident: 100_000_000 },
  ],
};

// AdminDashboardPage 호환 — 백엔드 미가동 시 폴백용 alias
export const ACCIDENT_DISTRIBUTION_FALLBACK = ACCIDENT_DISTRIBUTION;
export const RECENT_INCIDENTS_FALLBACK = RECENT_INCIDENTS;
export const PENDING_STUDENTS_FALLBACK = PENDING_STUDENTS;

// 사고 유형별 표시 색상 — 백엔드 응답에 color 필드가 없을 때 클라이언트 매핑용
export const ACCIDENT_TYPE_COLOR = {
  '기계 (회전체·끼임)': '#E60000',
  '화학 (화상·중독)':   '#F59E0B',
  '전기 (감전·합선)':   '#3B82F6',
  '기타 (외상·출혈)':   '#6B7280',
};

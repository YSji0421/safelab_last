// 관리자 대시보드용 mock 통계
// 실제 백엔드 SafetyController 응답 형태와 동일하게 맞춤

export const ADMIN_KPI = {
  totalStudents: 412,
  enrolledStudents: 378,
  completionRate: 68,
  pendingStudents: 121,
  recentIncidents7d: 3,
  scenariosCompleted: 1284,
};

export const DEPT_PROGRESS = [
  { id: 'chem', name: '화공환경과', total: 102, completed: 78, rate: 76, risk: 'high' },
  { id: 'mech', name: '기계과', total: 118, completed: 71, rate: 60, risk: 'high' },
  { id: 'elec', name: '전기정보과', total: 96, completed: 70, rate: 73, risk: 'mid' },
  { id: 'comp', name: '컴퓨터정보과', total: 96, completed: 62, rate: 65, risk: 'low' },
];

export const ACCIDENT_DISTRIBUTION = [
  { type: '화상', count: 7, color: '#E60000' },
  { type: '외상/절단', count: 5, color: '#F59E0B' },
  { type: '중독/흡입', count: 3, color: '#8B5CF6' },
  { type: '감전', count: 2, color: '#3B82F6' },
  { type: '기타', count: 1, color: '#6B7280' },
];

export const RECENT_INCIDENTS = [
  { date: '2026-04-28', dept: '화공환경과', summary: '실험 중 황산 피부 접촉 (경상)', status: '신고완료' },
  { date: '2026-04-25', dept: '기계과', summary: '그라인더 파편 안구 자극 (경상)', status: '치료중' },
  { date: '2026-04-19', dept: '전기정보과', summary: '실습실 합선 화재 — 인명피해 없음', status: '복구완료' },
];

export const PENDING_STUDENTS = [
  { studentNo: '20245010', name: '김민수', dept: '화공환경과', progress: '0/2', daysLeft: 12 },
  { studentNo: '20245011', name: '이지윤', dept: '화공환경과', progress: '1/2', daysLeft: 12 },
  { studentNo: '20245034', name: '박서준', dept: '기계과', progress: '0/2', daysLeft: 18 },
  { studentNo: '20245052', name: '최예진', dept: '기계과', progress: '0/2', daysLeft: 18 },
  { studentNo: '20245078', name: '정도윤', dept: '전기정보과', progress: '1/2', daysLeft: 7 },
  { studentNo: '20245102', name: '강하늘', dept: '컴퓨터정보과', progress: '0/2', daysLeft: 25 },
];

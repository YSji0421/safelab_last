// 모든 학과 공통 긴급연락처 (전국 + 학교 공통)
// 출처: 약관집 "한국교육시설안전원" 사고신고 채널 + 공공 응급번호

export const COMMON_EMERGENCY = [
  {
    category: '응급/119',
    items: [
      {
        label: '119 (소방·구급)',
        phone: '119',
        desc: '화재·구급·구조 — 부상·중독·화상 발생 시 즉시',
        urgent: true,
      },
      {
        label: '112 (경찰)',
        phone: '112',
        desc: '폭발물·사건사고·범죄',
        urgent: true,
      },
      {
        label: '1339 (질병관리청)',
        phone: '1339',
        desc: '감염병·중독 의심 24시간 상담',
      },
    ],
  },
  {
    category: '학교 내부',
    items: [
      {
        label: '인하공전 보건실',
        phone: '032-870-2299',
        desc: '경상·응급처치 (운영시간 내)',
      },
      {
        label: '인하공전 안전관리실',
        phone: '032-870-2114',
        desc: '실험실 사고 1차 신고',
        urgent: true,
      },
      {
        label: '학생복지처',
        phone: '032-870-2191',
        desc: '사고 후 학사·복지 상담',
      },
    ],
  },
  {
    category: '연구실안전공제 신고',
    items: [
      {
        label: '한국교육시설안전원',
        phone: '02-6710-1700',
        desc: '연구실 사고 공제 신고 — 사고 인지 즉시 통지 의무 (약관 제11조)',
      },
    ],
  },
];

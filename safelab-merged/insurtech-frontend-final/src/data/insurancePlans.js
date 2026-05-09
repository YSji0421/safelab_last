// 인하공전 가입 보험(공제) 4종 + 연구실안전공제 약관 — 시뮬레이터 계산용 시드.
// 출처: 「인하공전 2026 대학안전관리계획」 PDF p.68~70 + 「연구실안전공제」 약관(별표1).

// 4종 보험 가입 정보 — PDF p.68~70
export const INSURANCE_PLANS = {
  universityLiability: {
    id: 'universityLiability',
    name: '대학배상책임공제',
    icon: '🏛️',
    legalBasis: '학교안전법 제29조 / 민법 제750조',
    coversWho: '학생·교직원·방문객',
    benefits: {
      personalLiability: { perPerson: 100_000_000, perAccident: 1_000_000_000, label: '대인 배상' },
      propertyLiability: { perPerson: 100_000_000, perAccident: 100_000_000, label: '대물 배상' },
      treatmentOnCampus: { perPerson: 3_000_000, label: '교내·외 치료비' },
      deathDisability: { perPerson: 100_000_000, label: '사망·후유장해' },
    },
    deductible: 100_000,
    note: '학교 운영자의 과실로 발생한 사고 배상 — 자기부담금 10만원',
  },
  facilitySafety: {
    id: 'facilitySafety',
    name: '교육시설안전공제',
    icon: '🏗️',
    legalBasis: '화재로 인한 재해보상과 보험가입에 관한 법률 제5조',
    coversWho: '교내 시설 화재·붕괴·폭발 피해자',
    benefits: {
      fireDeath: { perPerson: 150_000_000, perAccident: 1_000_000_000, label: '화재 인명' },
      fireProperty: { perAccident: 1_000_000_000, label: '화재 재물' },
      facilityOwner: { perPerson: 300_000_000, perAccident: 1_000_000_000, label: '시설소유자 배상' },
    },
    deductible: 0,
    note: '화재·벼락·폭발·붕괴·태풍·홍수 등 시설 사고 — 「특수건물 화재보험」 의무',
  },
  labSafety: {
    id: 'labSafety',
    name: '연구실안전공제',
    icon: '🧪',
    legalBasis: '연구실 안전환경 조성에 관한 법률 제26조',
    coversWho: '연구활동종사자(학생·연구원)',
    benefits: {
      survivors: { perPerson: 200_000_000, label: '유족급여' },
      disability: { perPerson: 200_000_000, label: '장해급여 (1급)' },
      treatment: { perAccident: 2_000_000_000, label: '요양급여 (의료비 실비)' },
      hospitalDaily: { perDay: 50_000, maxDays: 30, label: '입원급여 (4일~30일)' },
      tuitionLoss: { perPerson: 1_000_000, label: '등록금 손실 지원 (15일+ 입원)' },
      dormLoss: { perPerson: 300_000, label: '기숙사비 지원' },
      caregiver: { perDay: 44_760, maxDays: 30, label: '간병비 (전문)' },
    },
    deductible: 0,
    note: '연구활동 중 사고 — 과실 무관 보상 / 약관 제3조 / 별표1 후유장해 1~14급',
    clauses: ['제3조', '제4조', '제6조', '제7조', '제8조', '제9조', '제11조'],
  },
  freshmenOT: {
    id: 'freshmenOT',
    name: '신입생 OT 담보',
    icon: '🎓',
    legalBasis: '대학종합보험(공제) 특약',
    coversWho: '신입생 / 학교 행사 참가자',
    benefits: {
      treatment: { perPerson: 3_000_000, label: 'OT 중 치료비' },
      deathDisability: { perPerson: 100_000_000, label: 'OT 중 사망·후유장해' },
    },
    deductible: 0,
    note: '입학식·OT·졸업식 등 학교 행사 중 사고',
  },
};

export const INSURANCE_PLAN_LIST = Object.values(INSURANCE_PLANS);

// 부상 정도 카탈로그 — 시뮬레이터 입력용
// 각 시나리오에 적용 가능한 plan + benefit 키를 매핑.
export const INJURY_SEVERITIES = [
  {
    id: 'minor',
    label: '경상 (응급처치)',
    icon: '🩹',
    desc: '구급상자·아이워시 처치, 출근/등교 가능',
    treatmentDays: 0,
    hospitalDays: 0,
    disabilityGrade: null,
    death: false,
  },
  {
    id: 'outpatient',
    label: '통원 치료',
    icon: '🏥',
    desc: '통원 1~2주 — 외래 진료비 발생',
    treatmentDays: 7,
    hospitalDays: 0,
    treatmentCost: 500_000, // 평균 통원 비용 추정
    disabilityGrade: null,
    death: false,
  },
  {
    id: 'admit_short',
    label: '단기 입원 (3~7일)',
    icon: '🛏️',
    desc: '4~7일 입원 — 입원급여 시작',
    treatmentDays: 14,
    hospitalDays: 5,
    treatmentCost: 2_000_000,
    disabilityGrade: null,
    death: false,
  },
  {
    id: 'admit_long',
    label: '장기 입원 (15일+)',
    icon: '🚑',
    desc: '15일 이상 입원 — 등록금/기숙사비 지원 발동',
    treatmentDays: 30,
    hospitalDays: 30,
    treatmentCost: 8_000_000,
    disabilityGrade: null,
    death: false,
  },
  {
    id: 'disability_minor',
    label: '경도 후유장해 (10~14급)',
    icon: '♿',
    desc: '약관 별표1 10~14급 — 가입금액의 10~25%',
    treatmentDays: 60,
    hospitalDays: 14,
    treatmentCost: 12_000_000,
    disabilityGrade: 12,
    disabilityRate: 0.15, // 12급 약 15%
    death: false,
  },
  {
    id: 'disability_severe',
    label: '중증 후유장해 (1~3급)',
    icon: '🦽',
    desc: '약관 별표1 1~3급 — 가입금액의 80~100%',
    treatmentDays: 180,
    hospitalDays: 60,
    treatmentCost: 50_000_000,
    disabilityGrade: 1,
    disabilityRate: 1.0,
    death: false,
  },
  {
    id: 'death',
    label: '사망',
    icon: '🕯️',
    desc: '유족급여 + 장의비 — 가입금액 전액',
    treatmentDays: 0,
    hospitalDays: 0,
    treatmentCost: 0,
    disabilityGrade: null,
    death: true,
    funeralCost: 5_000_000,
  },
];

// 시뮬레이터 핵심 — 사고 유형, 부상 정도, 가입 보험을 받아 보상액 산정
// 반환: { plan별 항목 list, 합계 등 }
export function simulateClaim({ severityId, planIds }) {
  const sev = INJURY_SEVERITIES.find((s) => s.id === severityId);
  if (!sev) return null;
  const plans = (planIds || []).map((id) => INSURANCE_PLANS[id]).filter(Boolean);

  const lines = []; // { planId, planName, benefit, amount, formula, clause? }

  for (const plan of plans) {
    if (sev.death) {
      // 사망 - 유족급여
      if (plan.id === 'labSafety') {
        lines.push({
          planId: plan.id,
          planName: plan.name,
          benefit: '유족급여',
          amount: plan.benefits.survivors.perPerson,
          formula: `약관 제7조 — 가입금액 전액 ${(plan.benefits.survivors.perPerson / 100_000_000).toFixed(1)}억`,
        });
      }
      if (plan.id === 'universityLiability') {
        lines.push({
          planId: plan.id,
          planName: plan.name,
          benefit: '사망·후유장해',
          amount: plan.benefits.deathDisability.perPerson,
          formula: `학교 과실 시 — 1인 ${(plan.benefits.deathDisability.perPerson / 100_000_000).toFixed(1)}억`,
        });
      }
      if (plan.id === 'freshmenOT') {
        lines.push({
          planId: plan.id,
          planName: plan.name,
          benefit: 'OT 중 사망',
          amount: plan.benefits.deathDisability.perPerson,
          formula: '학교 행사 중 사고 시',
        });
      }
      if (plan.id === 'facilitySafety') {
        lines.push({
          planId: plan.id,
          planName: plan.name,
          benefit: '시설 화재·붕괴 사망',
          amount: plan.benefits.fireDeath.perPerson,
          formula: '시설 화재·폭발·붕괴 시',
        });
      }
      // 장의비 (연구실 약관)
      if (plan.id === 'labSafety' && sev.funeralCost) {
        lines.push({
          planId: plan.id,
          planName: plan.name,
          benefit: '장의비',
          amount: sev.funeralCost,
          formula: `약관 제8조 — 유족급여 지급 시`,
        });
      }
    } else if (sev.disabilityGrade) {
      // 후유장해
      if (plan.id === 'labSafety') {
        const amt = Math.round(plan.benefits.disability.perPerson * (sev.disabilityRate || 0.1));
        lines.push({
          planId: plan.id,
          planName: plan.name,
          benefit: `장해급여 ${sev.disabilityGrade}급`,
          amount: amt,
          formula: `약관 제6조 별표1 — 1급 가입금액의 ${(sev.disabilityRate * 100).toFixed(0)}%`,
        });
      }
    } else {
      // 부상 — 요양급여(치료비), 입원급여
      if (plan.id === 'labSafety') {
        if (sev.treatmentCost > 0) {
          lines.push({
            planId: plan.id,
            planName: plan.name,
            benefit: '요양급여 (치료비 실비)',
            amount: sev.treatmentCost,
            formula: `약관 제4조 — 의료비 실비 (한도 ${(plan.benefits.treatment.perAccident / 100_000_000).toFixed(0)}억)`,
          });
        }
        if (sev.hospitalDays >= 4) {
          const days = Math.min(sev.hospitalDays - 3, 30); // 4일째부터 30일까지
          lines.push({
            planId: plan.id,
            planName: plan.name,
            benefit: `입원급여 ${days}일`,
            amount: days * plan.benefits.hospitalDaily.perDay,
            formula: `약관 제9조 — ${days}일 × 5만원/일 (4일째부터)`,
          });
        }
        if (sev.hospitalDays >= 15) {
          lines.push({
            planId: plan.id,
            planName: plan.name,
            benefit: '등록금 손실 지원',
            amount: plan.benefits.tuitionLoss.perPerson,
            formula: '특약 제1장 — 15일+ 입원 시 등록금 100만 한도',
          });
          lines.push({
            planId: plan.id,
            planName: plan.name,
            benefit: '기숙사비 지원',
            amount: plan.benefits.dormLoss.perPerson,
            formula: '특약 — 15일+ 입원 시 30만 한도',
          });
        }
      }
      if (plan.id === 'universityLiability' && sev.treatmentCost > 0) {
        const cap = plan.benefits.treatmentOnCampus.perPerson;
        lines.push({
          planId: plan.id,
          planName: plan.name,
          benefit: '교내·외 치료비',
          amount: Math.min(sev.treatmentCost, cap),
          formula: `1인 한도 ${(cap / 10_000).toFixed(0)}만 — 학교 과실 시`,
          deductible: plan.deductible,
        });
      }
      if (plan.id === 'freshmenOT' && sev.treatmentCost > 0) {
        const cap = plan.benefits.treatment.perPerson;
        lines.push({
          planId: plan.id,
          planName: plan.name,
          benefit: 'OT 중 치료비',
          amount: Math.min(sev.treatmentCost, cap),
          formula: `1인 한도 ${(cap / 10_000).toFixed(0)}만 — 학교 행사 중`,
        });
      }
    }
  }

  // 자기부담금 차감
  const totalDeductible = lines.reduce((sum, l) => sum + (l.deductible || 0), 0);
  const totalGross = lines.reduce((sum, l) => sum + l.amount, 0);
  const totalNet = Math.max(0, totalGross - totalDeductible);

  return {
    severity: sev,
    lines,
    totalGross,
    totalDeductible,
    totalNet,
  };
}

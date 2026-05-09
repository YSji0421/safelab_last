export const riskKeywords = [
  // ── 공통 (법적/행정) ──
  { keyword: "사망", severity: "high", message: "중대 사안: 사망 관련 언급" },
  { keyword: "사기", severity: "high", message: "보험 사기 의심 키워드" },
  { keyword: "소송", severity: "high", message: "소송 제기 가능성" },
  { keyword: "고소", severity: "high", message: "고소 언급 — 법적 대응 고려" },
  { keyword: "자살", severity: "high", message: "민감 사안: 자살 관련 언급" },
  { keyword: "변호사", severity: "high", message: "법률 대리인 개입 언급" },
  { keyword: "금감원", severity: "high", message: "금감원 민원 가능성" },
  { keyword: "민원", severity: "medium", message: "민원 제기 언급" },
  { keyword: "거부", severity: "medium", message: "고객 거부 의사 표명" },
  { keyword: "거절", severity: "medium", message: "고객 거절 의사 표명" },
  { keyword: "불만", severity: "medium", message: "고객 불만 표시" },
  { keyword: "취소", severity: "medium", message: "계약·합의 취소 언급" },
  { keyword: "환불", severity: "medium", message: "환불 요청 언급" },
  { keyword: "녹취", severity: "medium", message: "녹취 진행 언급 — 대응 유의" },
  { keyword: "지연", severity: "low", message: "처리 지연 불만" },
  { keyword: "착오", severity: "low", message: "착오·오류 가능성 제기" },

  // ── 공대 실험실/실습 특화 위험어 ──
  { keyword: "폭발", severity: "high", message: "🧪 실험실 폭발 위험 — 즉시 대피·119 신고" },
  { keyword: "실명", severity: "high", message: "눈 손상 위험 — 안과 응급 이송" },
  { keyword: "중독", severity: "high", message: "🧪 화학 중독 의심 — 해독·응급실 이송" },
  { keyword: "질식", severity: "high", message: "질식 위험 — 환기·산소 공급" },
  { keyword: "추락", severity: "high", message: "추락 사고 — 척추 보호 후 이송" },
  { keyword: "감전", severity: "high", message: "⚡ 감전 — 전원 차단 확인 후 심전도 평가" },
  { keyword: "누전", severity: "high", message: "⚡ 누전 — 실험실 전기안전점검 필요" },
  { keyword: "화상", severity: "medium", message: "🔥 화상 — 찬물 세척·진료 필요" },
  { keyword: "부상", severity: "medium", message: "실습 중 부상 — 사고보고서 작성" },
  { keyword: "골절", severity: "medium", message: "골절 의심 — 정형외과 진료" },
  { keyword: "약품 노출", severity: "medium", message: "🧪 화학약품 노출 — 세척 및 MSDS 확인" },
  { keyword: "흄", severity: "medium", message: "🧪 유해 흄 흡입 가능성 — 환기·검사" },
  { keyword: "어지럼증", severity: "low", message: "어지럼증 — 유해물질 노출 가능성 점검" }
];

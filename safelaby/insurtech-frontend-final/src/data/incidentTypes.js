// 사진 인식 → 매칭되는 사고 유형 정의
// Gemini Vision 응답을 이 카탈로그의 id 로 매핑하고, mock fallback 시에도 동일 데이터 사용.
// 약관 인용은 .claude/labsafety_pact_fitz.txt (연구실안전공제) 기반.

export const INCIDENT_TYPES = {
  chemical_burn: {
    id: 'chemical_burn',
    name: '화학약품 화상 / 피부 노출',
    icon: '🧪',
    severity: 'high',
    severityLabel: '응급',
    visualKeywords: ['실험복', '시약', '노란/빨간 액체', '피부 발진', '화상 부위', '흄후드', '산성·염기성 시약'],
    immediateSteps: [
      { num: 1, title: '오염된 의복·장신구 즉시 제거', detail: '시약이 묻은 부위를 빠르게 노출시키고, 마찰은 피하세요.' },
      { num: 2, title: '미온수로 15분 이상 세척', detail: '눈에 들어간 경우 아이워시 스테이션에서 15분간 세안.' },
      { num: 3, title: '119 호출 (중증) / 보건실 직행 (경증)', detail: '의식 소실, 광범위 화상은 즉시 119.' },
      { num: 4, title: '학과 안전관리자 통지', detail: '약관 제11조 — 사고 인지 즉시 안전원에 통지해야 보상 가능.' },
      { num: 5, title: '시약 라벨·MSDS 사진 확보', detail: '청구 시 사고 원인 증빙으로 사용.' },
    ],
    coverage: ['요양급여', '입원급여', '장해급여'],
    clauses: [
      { code: '제3조 ②', desc: '유독가스 / 유독물질 흡입·흡수·섭취 중독증상 보상' },
      { code: '제4조', desc: '요양급여 — 의료비 실비 (진찰·처치·수술·입원·간병)' },
      { code: '제9조', desc: '입원급여 — 4일 이상 입원 시 일당 (3일 초과분부터)' },
    ],
  },

  thermal_burn: {
    id: 'thermal_burn',
    name: '열·기계 화상',
    icon: '🔥',
    severity: 'high',
    severityLabel: '응급',
    visualKeywords: ['납땜 인두', '핫플레이트', '오토클레이브', '뜨거운 금속', '물집', '발적'],
    immediateSteps: [
      { num: 1, title: '열원 차단 + 물집 보존', detail: '터뜨리지 말고 흐르는 미온수로 10분 식히세요.' },
      { num: 2, title: '거즈로 가볍게 덮기', detail: '얼음 직접 접촉 금지. 동상 위험.' },
      { num: 3, title: '병원 외래 / 응급실 이송', detail: '2도 이상 또는 손바닥 크기 초과 시 응급실.' },
      { num: 4, title: '안전관리자 통지', detail: '열원·작업 단계 사진 확보.' },
    ],
    coverage: ['요양급여', '입원급여'],
    clauses: [
      { code: '제3조 ①', desc: '연구활동 중 상해 보상' },
      { code: '제4조', desc: '요양급여 — 화상 치료비 실비' },
    ],
  },

  electric_shock: {
    id: 'electric_shock',
    name: '전기 감전',
    icon: '⚡',
    severity: 'high',
    severityLabel: '응급',
    visualKeywords: ['배전반', '브레이커', '노출 도선', '의식 저하', '심폐소생'],
    immediateSteps: [
      { num: 1, title: '먼저 전원 차단', detail: '맨손으로 환자 접촉 금지. 절연 도구로 분리.' },
      { num: 2, title: '의식·호흡 확인', detail: '없으면 즉시 119 + CPR 시작.' },
      { num: 3, title: '심전도 모니터링 위해 입원 권장', detail: '경미한 감전도 부정맥 위험 24시간 모니터링.' },
      { num: 4, title: '안전관리자 + 학과장 즉시 통지' },
    ],
    coverage: ['요양급여', '입원급여', '장해급여', '유족급여'],
    clauses: [
      { code: '제3조 ①', desc: '연구활동 중 상해 보상' },
      { code: '제6조', desc: '장해급여 — 후유장해 등급별 보상 (별표1)' },
      { code: '제7조', desc: '유족급여 — 사망 시 가입금액 전액' },
    ],
  },

  mechanical_injury: {
    id: 'mechanical_injury',
    name: '기계 절단·끼임',
    icon: '⚙️',
    severity: 'high',
    severityLabel: '응급',
    visualKeywords: ['선반', '밀링', '그라인더', '회전체', '톱', '절단부', '출혈'],
    immediateSteps: [
      { num: 1, title: '기계 정지 + 비상 정지 버튼', detail: '잔여 회전 멈출 때까지 접근 금지.' },
      { num: 2, title: '지혈 — 깨끗한 거즈로 직접 압박', detail: '절단부는 생리식염수 적신 거즈에 싸 비닐 + 얼음팩과 함께 후송.' },
      { num: 3, title: '119 호출 — 골든타임 6시간', detail: '재접합 가능 시간 확보.' },
      { num: 4, title: '기계 상태·작업 SOP 사진 확보' },
    ],
    coverage: ['요양급여', '입원급여', '장해급여'],
    clauses: [
      { code: '제3조 ①', desc: '연구활동 중 상해 보상' },
      { code: '제6조', desc: '장해급여 — 절단·시력 등 후유장해 등급 (별표1 1~14급)' },
    ],
  },

  fall: {
    id: 'fall',
    name: '추락·낙상',
    icon: '🪜',
    severity: 'medium',
    severityLabel: '주의',
    visualKeywords: ['실험대', '계단', '미끄럼', '바닥 누수', '의자에서 떨어짐'],
    immediateSteps: [
      { num: 1, title: '머리·척추 손상 의심 시 함부로 옮기지 말기', detail: '의식 있어도 목 / 등 통증 호소하면 119.' },
      { num: 2, title: '가벼운 타박상 — RICE 처치', detail: '안정·냉찜질·압박·거상.' },
      { num: 3, title: '병원 X-ray로 골절 여부 확인', detail: '실금성 골절은 즉시 보이지 않음.' },
      { num: 4, title: '바닥 상태·낙상 지점 사진 확보' },
    ],
    coverage: ['요양급여', '입원급여'],
    clauses: [
      { code: '제3조 ①', desc: '연구활동 중 상해 보상' },
      { code: '제9조', desc: '입원급여 — 4일 이상 입원 시 일당' },
    ],
  },

  fire_explosion: {
    id: 'fire_explosion',
    name: '화재·폭발',
    icon: '💥',
    severity: 'high',
    severityLabel: '응급',
    visualKeywords: ['연기', '불꽃', '리튬 시약', '배터리 발화', '검은 그을음', '흄후드 화재'],
    immediateSteps: [
      { num: 1, title: '즉시 대피 + 119 호출', detail: '소화기 사용은 초기 5초 이내일 때만.' },
      { num: 2, title: '가스·전원 차단', detail: '연구실 차단 위치 사전 인지 필수.' },
      { num: 3, title: '환자 — 옷에 불 붙으면 STOP·DROP·ROLL', detail: '뛰지 말고 굴러 산소 차단.' },
      { num: 4, title: '소방·119에 시약 종류 사전 고지', detail: '리튬 / 알칼리 금속 등은 물 사용 금지.' },
    ],
    coverage: ['요양급여', '입원급여', '장해급여', '유족급여', '장의비'],
    clauses: [
      { code: '제3조 ①', desc: '연구활동 중 상해 보상' },
      { code: '제7조', desc: '유족급여 — 사망 시 가입금액 전액' },
      { code: '제8조', desc: '장의비 — 유족급여 지급 시' },
    ],
  },

  unknown: {
    id: 'unknown',
    name: '식별 어려움',
    icon: '❓',
    severity: 'low',
    severityLabel: '판별 필요',
    visualKeywords: [],
    immediateSteps: [
      { num: 1, title: '안전한 곳으로 이동 + 호흡 확인' },
      { num: 2, title: '119 호출 — 상황 설명' },
      { num: 3, title: '학과 안전관리자에게 사진 전송 + 통지' },
      { num: 4, title: '약관 제11조 — 즉시 통지가 보상 조건' },
    ],
    coverage: ['요양급여'],
    clauses: [
      { code: '제3조 ①', desc: '연구활동 중 상해 보상' },
      { code: '제11조', desc: '사고 인지 즉시 안전원 통지 의무' },
    ],
  },
};

// Gemini 프롬프트가 응답할 수 있는 id 목록 (validation 용)
export const INCIDENT_TYPE_IDS = Object.keys(INCIDENT_TYPES);

export const getIncidentType = (id) =>
  INCIDENT_TYPES[id] || INCIDENT_TYPES.unknown;

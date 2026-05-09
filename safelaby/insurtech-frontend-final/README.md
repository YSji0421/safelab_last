# SafeLab — 인하공전 연구실 안전 통합 플랫폼

## 팀: 인슈어테크 | 이예진, 지윤석 · 2026 학교 경진대회

「연구실 안전환경 조성에 관한 법률」 제26조에 근거한 **「연구실안전공제」** 약관을 베이스로, 공대 학과의 형식적인 안전교육을 **AI 시나리오 + 약관 기반 퀴즈**로 실효성 있게 만든 통합 플랫폼 + 외부 소개용 SafeLab 랜딩페이지.

## 빠른 실행

```bash
cd insurtech-frontend-final
npm install     # 첫 실행 시
npm start
```

브라우저: <http://localhost:3000/>

> 이전에 nested 폴더(`insurtech-frontend/`)로 두 단계였던 구조를 한 단계로 정리했습니다. 이제 `insurtech-frontend-final/` 바로 안에서 실행합니다.

### 백엔드 (선택 — 미실행 시 자동 mock 모드)

```bash
cd adjuster-system
gradlew.bat bootRun     # Windows
./gradlew bootRun       # macOS/Linux
```

프론트 `package.json`의 `proxy` 설정으로 `/api/*` 자동 라우팅.

## 진입 흐름

```
/                                EntryPage (관리자 / 학생 분기)
/landing                         SafeLab 외부 소개 랜딩 (서비스 데모용)
/student/department              학과 선택 (이름·학번)
/student/safety/:dept            학과별 안전교육 메인 (시나리오 목록)
/student/safety/:dept/scenario/:sid   AI 1인칭 시나리오
/student/safety/:dept/quiz/:sid       약관 기반 5문항 퀴즈
/student/safety/:dept/certificate     이수증 (인쇄/PDF)
/admin/login                     관리자 로그인 (admin / admin1234)
/admin                           학생 이수 현황 + 안전 대시보드
/emergency                       학과별·공통 긴급연락처 (우하단 빨간 FAB)
/incident/photo                  사진 → AI 사고 인식 + 즉시 조치 + 약관 매핑
/insurance/consult               「연구실안전공제」 AI 상담 (장치 체크)
/insurance/room/:roomId          상담실
/insurance/summary/:roomId       상담 종료 요약
```

## 폴더 구조

```
insurtech-frontend-final/
├── README.md                ← (이 문서)
├── package.json             ← React 18 + CRA + Tailwind + framer-motion + lucide-react
├── postcss.config.js
├── tailwind.config.js       ← Tailwind 격리: .landing-root 스코프, preflight off
├── public/
│   ├── index.html           ← Manrope/Inter/Pretendard 폰트
│   └── landing/             ← SafeLab 랜딩 이미지
│       ├── safelab-hero.png
│       ├── safelab-dashboard.png
│       └── README.md
├── src/
│   ├── index.js             ← global.css → theme.css → index.css 순 import
│   ├── index.css            ← Tailwind directives + CSS 변수 (브랜드 컬러 토큰)
│   ├── App.js               ← 모든 라우트 정의
│   ├── styles/
│   │   ├── global.css       ← 글로벌 reset (보존 대상)
│   │   └── theme.css        ← 모바일/웹 공통 토큰 (Vodafone 풍)
│   ├── pages/
│   │   ├── EntryPage.js                관리자/학생 분기
│   │   ├── SafetyLandingPage.jsx       SafeLab 외부 소개 랜딩 (이번 작업)
│   │   ├── DepartmentSelectPage.js     학과 선택
│   │   ├── SafetyMainPage.js           학과별 안전교육 허브
│   │   ├── SafetyScenarioPage.js       AI 1인칭 시나리오
│   │   ├── SafetyQuizPage.js           약관 기반 퀴즈
│   │   ├── CertificatePage.js          이수증
│   │   ├── AdminLoginPage.js / AdminDashboardPage.js
│   │   ├── EmergencyPage.js
│   │   └── (보험 모듈) DeviceCheckPage / ConsultationRoomPage / SummaryPage
│   ├── components/
│   │   ├── EmergencyFab.js  ← 모든 페이지 우하단 빨간 FAB
│   │   └── landing/         ← SafeLab 랜딩 전용 (이번 작업)
│   │       ├── Header.jsx
│   │       ├── Hero.jsx
│   │       ├── About.jsx
│   │       ├── Lineup.jsx
│   │       ├── ContactForm.jsx
│   │       ├── Footer.jsx
│   │       └── SmartLink.jsx (라우트/앵커/외부링크 자동 분기)
│   ├── data/
│   │   ├── departments.js          학과별 시나리오·긴급연락처
│   │   ├── scenarios.js            사고 시나리오 + 약관 매핑
│   │   ├── labsafetyExcerpt.js     약관 핵심 발췌 (Gemini 컨텍스트)
│   │   ├── adminMockStats.js       관리자 대시보드 mock 통계
│   │   ├── demoScripts.js          시연용 상담 대본
│   │   ├── riskKeywords.js         리스크 키워드 사전
│   │   ├── emergencyCommon.js      공통 긴급연락처
│   │   ├── landing.js              SafeLab 랜딩 카피·메뉴·라우트 (이번 작업)
│   │   └── labsafety.js            연구실안전공제 RAG 시드 (이번 작업)
│   ├── hooks/
│   │   └── useToast.js             Context 기반 자체 Toast (이번 작업)
│   └── services/
│       └── gemini.js               Gemini 1.5 Flash 호출 + key 설정
└── vercel.json
```

## SafeLab 랜딩페이지 (`/landing`)

이번 작업으로 추가된 외부 소개용 1페이지.

### 어디서 무엇을 수정하나

| 변경하고 싶은 것 | 파일 |
|---|---|
| 모든 카피·메뉴·카드·이미지 경로 | `src/data/landing.js` |
| 컬러 토큰 (시안/옐로우/핑크/민트) | `src/index.css` 의 `:root` |
| 폰트 | `public/index.html` Google Fonts + `tailwind.config.js` |
| 메인 비주얼 이미지 | `public/landing/safelab-hero.png` (Hero) / `safelab-dashboard.png` (Lineup 1번) |
| 도입 문의 폼 API | `src/components/landing/ContactForm.jsx` 의 `// TODO: API 연결` |

### 카드 매핑 (랜딩 → inner 라우트)

- 학생 시작하기 / Hero CTA / 맞춤 커리큘럼 / 이수증 발급 / SafeLab Education → `/student/department`
- 관리자 로그인 / 리스크 모니터링 / RiskRadar → `/admin/login`
- 긴급 대응 → `/emergency`
- CampusGuard → `/insurance/consult`

### Tailwind 격리 메커니즘

랜딩 페이지에만 Tailwind를 적용하고 다른 페이지(`global.css`/`theme.css`로 스타일링)에 영향이 없도록 **3중 가드**:

1. `tailwind.config.js`의 `content`가 `SafetyLandingPage.jsx` + `components/landing/**` 만 스캔
2. `important: '.landing-root'` — 모든 Tailwind 유틸이 `.landing-root .x` 로 격상
3. `corePlugins.preflight: false` — 글로벌 CSS reset 비활성

## RAG 자료

「연구실안전공제」 약관 풀 텍스트는 워크트리 루트의 `.claude/` 폴더에 보존:

- `.claude/labsafety_pact.txt` (PyMuPDF 1차 추출)
- `.claude/labsafety_pact2.txt`
- `.claude/labsafety_pact_fitz.txt` (가장 깔끔, 백엔드 RAG 임베딩 시드용)

발췌 + 사고 시나리오 + 공제급여 종류는 `src/data/labsafety.js` 에 한 곳으로 정리되어 있습니다 (Gemini 컨텍스트 + 화면 카피 단일 소스).

## Gemini API 연동 (선택)

1. <https://aistudio.google.com> 에서 API 키 발급 (무료)
2. `src/services/gemini.js` 상단의 `GEMINI_API_KEY` 값을 실제 키로 교체

미설정 상태에서도 학과별 시나리오 + 약관 퀴즈가 mock으로 동작합니다.

## 백엔드 API

| 엔드포인트 | 메서드 | 설명 |
|---|---|---|
| `/api/safety/courses/{deptId}` | GET | 학과별 시나리오/긴급연락처 |
| `/api/safety/courses` | GET | 전체 학과 목록 |
| `/api/safety/attempts` | POST | 학생 이수(퀴즈 통과) 기록 |
| `/api/safety/admin/progress` | GET | 관리자 대시보드 KPI + 학과별 진척 |

학생 흐름은 백엔드 미가동 시 localStorage로 진행되며, 가동 시 자동 동기화.

## 학과별 시연 컨텐츠

| 학과 | 시나리오 | 약관 매핑 |
|---|---|---|
| 화공환경과 | 황산 피부 접촉 / 유독가스 누출 | 제3조 ② 유독가스 흡입 중독 |
| 기계과 | 선반 끼임 / 그라인더 안구 비산 | 별표1 1~3급 (절단·시력) |
| 전기정보과 | 배전반 감전 / 분전반 화재 | 신경계 장해 / 화상 특약 |
| 컴퓨터정보과 | 서버실 UPS 화재 / 의식저하 | 화상 특약 / 응급 |

## 기술 스택

- **프론트**: React 18, React Router v6, Axios, Tailwind CSS, framer-motion, lucide-react, Gemini 1.5 Flash
- **백엔드**: Spring Boot 3, Spring Security, JPA, H2 (개발)
- **베이스 약관**: 「연구실안전공제」 (한국교육시설안전원)
- **개발 서버**: cross-env로 `HOST=localhost DANGEROUSLY_DISABLE_HOST_CHECK=true` 적용 (CRA 5 + WDS 4 allowedHosts 호환성 fix)

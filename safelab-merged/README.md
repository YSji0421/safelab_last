# SafeLab (Merged)

`safelab/`(백엔드 admin API + 서비스 진화)과 `safelaby/`(Aurora UI + 신규 페이지)를 통합한 결과물.

> **UI = safelaby 100% / 기능 = safelab + safelaby 합집합 (충돌 시 safelab 우선)**

---

## 폴더 구조

```
safelab-merged/
├── adjuster-system/                ← Spring Boot 백엔드 (safelab 통째)
├── insurtech-frontend-final/       ← React 프론트엔드 (safelaby 베이스 + 서비스/admin은 safelab)
├── docs/                           ← 발표자료·보고서 (safelab) + INVESTOR_REPORT.md
├── scripts/                        ← build_ppt.js, cloudtype-seed.sql (safelab)
├── setup/                          ← application-local.yml, frontend.env.local (gitignored)
├── CLAUDE.md                       ← Claude 세션 핸드오프 (safelaby)
├── MERGE_PLAN.md → ../             ← 합병 계획 (외부)
└── README.md                       ← (이 문서)
```

---

## 즉시 실행

### 프론트엔드 (메인 데모)

```bash
cd insurtech-frontend-final
npm install      # 첫 실행 시
npm start
```

브라우저: http://localhost:3000/

### 백엔드 (선택 — 미가동 시 mock으로 자동 폴백)

```bash
cd adjuster-system
./gradlew bootRun
```

기본 포트 8080. 프론트의 `proxy: http://localhost:8080`이 자동 연결.

---

## 라우트

| 경로 | 설명 |
|---|---|
| `/` | EntryPage — 진입 분기 |
| `/landing` | SafetyLandingPage (Tailwind 격리, Bento grid) |
| `/student/department` | 학과 선택 |
| `/student/safety/:dept` | 학과 안전교육 허브 |
| `/student/safety/:dept/scenario/:sid` | 사고 시나리오 |
| `/student/safety/:dept/quiz/:sid` | 약관 퀴즈 |
| `/student/safety/:dept/certificate` | 이수 인증서 |
| `/admin/login` | 관리자 로그인 (admin / admin1234) |
| `/admin` | 관리자 대시보드 (백엔드 fetch + 폴백 mock) |
| `/emergency` | 긴급 연락처 + 사진 신고 진입 |
| `/incident/photo` | 사진 → AI 사고 인식 (Gemini Vision) |
| `/insurance/consult` | 장치 체크 (카메라/마이크) |
| `/insurance/room/:roomId` | AI 화상 상담 (STT + 약관 챗봇) |
| `/insurance/summary/:roomId` | 상담 요약 |

---

## 통합 시 적용된 변경 사항

### 백엔드 (safelab 통째 채택)
- `safety/dto/AccidentDistributionItem.java`, `PendingStudent.java`, `RecentIncident.java` 추가
- `SafetyController` — `/api/safety/admin/accidents/distribution`, `/admin/accidents/recent`, `/admin/pending` 3개 endpoint 추가
- `SafetyService` — 위 endpoint용 정적 시드 데이터 제공 메서드
- `SecurityConfig` — CORS 명시적 설정 (`localhost:3000`, `safelab-eight.vercel.app`)

### 프론트 서비스 레이어 (safelab 채택)
- `services/api.js` — `safetyApi.getAccidentDistribution / getRecentIncidents / getPendingStudents` 추가, Gemini model env var
- `services/gemini.js` — gemini-2.5-flash 업그레이드 + thinkingConfig + JSON mime + **`askAboutClause` 약관 챗봇 함수**
- `services/tts.js` — Azure Speech REST 1차 + Web Speech 폴백
- `data/adminMockStats.js` — `*_FALLBACK` 네이밍 + `ACCIDENT_TYPE_COLOR` 분리
- `components/EmergencyFab.js` — 정밀 라우트 가드 (`/insurance/*` 등)

### 프론트 페이지 하이브리드 (safelaby UI + safelab 데이터 흐름)
- `pages/AdminDashboardPage.js` — Aurora UI 보존 + 3개 admin API 병렬 fetch + `looksValid` 가드 + KPI ?? 폴백
- `pages/ConsultationRoomPage.js` — AppShell·아바타 UI 보존 + STT debounce + 약관 챗봇 자동 트리거 + AI 발화 echo cooldown

### UI / 신규 페이지 (safelaby 그대로)
- `components/AppShell.js`, `PageHeader.js`, `landing/*` 7개
- `pages/SafetyLandingPage.jsx`, `IncidentPhotoPage.{js,css}`
- `data/incidentTypes.js`, `labsafety.js`, `landing.js`
- `services/incidentVision.js` (Gemini Vision)
- `hooks/useToast.js`
- `styles/theme.css` (Aurora 디자인 토큰)
- Tailwind 격리 (`tailwind.config.js`, `postcss.config.js`, `index.css`)

---

## 환경 변수

| 변수 | 용도 |
|---|---|
| `REACT_APP_GEMINI_API_KEY` | Gemini 2.5 Flash API 키 (미설정 시 mock 폴백) |
| `REACT_APP_GEMINI_MODEL` | 모델 override (기본 `gemini-2.5-flash`) |
| `REACT_APP_AZURE_SPEECH_KEY` | Azure TTS 키 (미설정 시 Web Speech 폴백) |
| `REACT_APP_AZURE_SPEECH_REGION` | Azure 리전 (기본 `koreacentral`) |
| `REACT_APP_AZURE_SPEECH_VOICE` | 한국어 voice (기본 `ko-KR-SunHiNeural`) |

설정 위치: `insurtech-frontend-final/.env.local` (gitignored). 샘플은 `setup/frontend.env.local` 참고.

---

## 빌드 검증 (수행 시점 기준)

- ✅ `npm install` exit 0
- ✅ `CI=true npm run build` — Compiled successfully (171.81 kB main.js, 21.55 kB main.css)
- ⚠️ `./gradlew build` — wrapper jar 부재로 미수행 (safelab 코드 통째 복사이므로 코드 자체는 안전, 사용자 환경에서 검증 필요)

---

## 통합 작업 로그 (git history)

```
3df08f5 feat(pages): adopt safelab admin fetch + clause chatbot — preserve safelaby UI
e1cd624 feat(frontend/services): adopt safelab — gemini-2.5 + askAboutClause, Azure TTS, safety admin APIs
7852357 feat(backend): adopt safelab adjuster-system — admin accident/incident/pending APIs + CORS
44f0e30 chore: import safelaby baseline (full src + adjuster-system)
36fb9d5 chore: import safelaby baseline
```

(이후 추가 commit은 사용자 요청에 따라 만들지 않음.)

# SafeLab + SafeLaby 통합 계획 (v2)

> 작성일: 2026-05-09 · 결과 폴더: **새 폴더 `safelab-merged/`**
> 목표: `safelab/`(서비스·백엔드 진화)과 `safelaby/`(UI 디자인 시스템)을 하나로 합친다.
> **UI = safelaby 100%. 기능·서비스 레이어 = 두 쪽의 합집합 (충돌 시 safelab 우선).**

---

## 1. 양쪽 프로젝트의 실체 (재분석 후)

처음 파악과 달리, **safelab이 더 늦게 발전한 버전**임이 확인됨. safelaby는 디자인 시스템을 갈아엎고 IncidentPhoto/Landing 페이지를 추가했지만, 그 사이 safelab이 따로 백엔드 admin API와 서비스 레이어를 강화한 듯 보임 (포크 후 양쪽 분기).

| 영역 | safelab의 우위 | safelaby의 우위 |
|---|---|---|
| **백엔드 admin API** | ⭐ 3개 endpoint + 3개 DTO + Service 메서드 + CORS 설정 | — |
| **`services/gemini.js`** | ⭐ gemini-2.5-flash, thinkingConfig, JSON mime, 강건한 에러 핸들링, **`askAboutClause` 약관 챗봇 함수** | gemini-1.5-flash, 단순 |
| **`services/tts.js`** | ⭐ Azure Speech REST 1차 + Web Speech 폴백 (한국어 voice) | Web Speech only |
| **`services/api.js`** | ⭐ `safetyApi.getAccident*`, `getRecent*`, `getPending*` + 모델 env var | — |
| **`ConsultationRoomPage.js` 기능** | ⭐ STT debounce + 약관 챗봇 자동 호출 + Azure echo cooldown + 긴급 버튼 | AppShell 래핑만 |
| **EmergencyFab hideOn** | ⭐ `/insurance/*`, `/admin/login` 등 정밀 가드 | 단순 가드 |
| **`pages/AdminDashboardPage.js`** | ⭐ 백엔드 fetch + fallback 패턴 + `looksValid` 가드 | mock-only |
| **`adminMockStats.js` 구조** | ⭐ `*_FALLBACK` 명명 + `ACCIDENT_TYPE_COLOR` 분리 | color 인라인 |
| **UI 디자인 시스템** | — | ⭐ `AppShell`, `PageHeader`, `aurora-orb`, `theme.css`, `glass-card`, eyebrow/Step 패턴 |
| **신규 페이지** | — | ⭐ `IncidentPhotoPage`, `SafetyLandingPage` |
| **신규 데이터** | — | ⭐ `incidentTypes.js`, `labsafety.js`, `landing.js` |
| **신규 컴포넌트** | — | ⭐ `components/landing/*` 7개 |
| **`hooks/useToast.js`** | — | ⭐ 있음 |
| **Tailwind 격리(`landing-root`)** | — | ⭐ `tailwind.config.js`, `postcss.config.js`, `index.css` |
| **`package.json` deps** | 기본 | ⭐ `framer-motion`, `lucide-react`, `tailwindcss`, `autoprefixer`, `postcss`, `cross-env` |
| **start 스크립트 호환성** | 기본 | ⭐ `cross-env HOST=localhost DANGEROUSLY_DISABLE_HOST_CHECK=true` (CRA5+WDS4 우회) |
| **App.js 라우트 네임스페이스** | `/room/:id`, `/summary/:id` | ⭐ `/insurance/room/:id`, `/insurance/summary/:id` (정리됨) |
| **프론트 폴더 구조** | `insurtech-frontend-final/insurtech-frontend/src/` (이중 nested 잔재) | ⭐ `insurtech-frontend-final/src/` (단일) |
| **부속 폴더** | ⭐ `docs/`, `scripts/`, `setup/` (발표자료·DB seed·환경설정 샘플) | ⭐ `CLAUDE.md` 핸드오프 |

**결론**: 두 분기가 보완적. 한쪽을 베이스로 두고 다른 쪽 변경분을 cherry-pick 하는 방식이 안전. UI 결정에 따라 **safelaby = base**.

---

## 2. 통합 전략

### 2-1. Master Rule

> **safelaby/ 전체를 `safelab-merged/`로 복사한 뒤, safelab에서 "기능 변경분"만 가져와 덮어쓴다.**
> "기능 변경분"의 정의: JSX 마크업/CSS/컴포넌트 구조와 무관하고, 데이터 흐름·API 호출·서비스·백엔드 로직만 바뀌는 것.

### 2-2. 영역별 처리 매트릭스

| 영역 | 처리 | 비고 |
|---|---|---|
| `adjuster-system/**` (백엔드 전체) | **safelab 통째로 채택** | safelaby의 백엔드는 동일하지만 admin API 누락. safelab을 그대로 쓰는 게 단순. |
| `insurtech-frontend-final/package.json` | **safelaby 채택** + safelab의 추가 dev 의존성 머지 (없음) | safelaby가 deps 우위. start script 보존. |
| `tailwind.config.js`, `postcss.config.js` | **safelaby 그대로 복사** | safelab엔 없음. |
| `src/index.js`, `src/index.css` | **safelaby 그대로** | Tailwind directive 보존. |
| `src/App.js` | **safelaby 그대로** (`/landing`, `/incident/photo` 라우트 보존) | safelab은 이 라우트 없음. |
| `src/components/AppShell.js`, `PageHeader.js`, `landing/**` | **safelaby 그대로** | UI 시스템. |
| `src/components/EmergencyFab.js` | **safelab 채택** (라우트 가드 더 정밀) | safelaby route(`/insurance/*`)와 호환. 추가로 `/incident/photo`만 hideOn 명단에 추가 검토. |
| `src/components/EmergencyFab.css` | **safelaby 그대로** | UI. |
| `src/styles/theme.css`, `global.css` | **safelaby 그대로** | 디자인 토큰 단일 소스. |
| `src/services/api.js` | **safelab 채택** (admin 메서드 + model env var 포함) | safelaby에 라우트 충돌 없음. |
| `src/services/gemini.js` | **safelab 채택** (gemini-2.5-flash + askAboutClause + 강건한 핸들링) | 단, safelaby의 `incidentVision.js`와 함께 가야 함. |
| `src/services/incidentVision.js` | **safelaby 그대로** | safelab엔 없음. |
| `src/services/tts.js` | **safelab 채택** (Azure 1차 + Web 폴백) | env vars 누락 시 폴백 동작 확인. |
| `src/services/riskDetector.js`, `scenarioMatcher.js` | 동일 — 그대로 | (확인 안 함, diff 비어 있을 가능성) |
| `src/data/departments.js` | **safelaby 채택** | trivial 차이 (export 정렬). |
| `src/data/adminMockStats.js` | **safelab 채택** (`*_FALLBACK` 네이밍 + `ACCIDENT_TYPE_COLOR` 분리) | AdminDashboardPage가 이 형태를 참조. |
| `src/data/incidentTypes.js`, `labsafety.js`, `landing.js` | **safelaby 그대로** | 신규 데이터. |
| `src/data/scenarios.js`, `labsafetyExcerpt.js`, `riskKeywords.js`, `emergencyCommon.js`, `demoScripts.js` | 동일 — 그대로 | |
| `src/hooks/useToast.js`, `useWebRTC.js` | **safelaby 그대로** | |
| `src/pages/SafetyLandingPage.jsx` | **safelaby 그대로** | 신규. |
| `src/pages/IncidentPhotoPage.{js,css}` | **safelaby 그대로** | 신규. |
| `src/pages/EntryPage.js`, `DepartmentSelectPage.js`, `SafetyMainPage.js`, `SafetyScenarioPage.js`, `SafetyQuizPage.js`, `CertificatePage.js`, `AdminLoginPage.js`, `EmergencyPage.js`, `DeviceCheckPage.js`, `SummaryPage.js` | **safelaby 그대로** | 모두 AppShell + aurora-orb + glass-card 적용된 safelaby 버전이 시각적 우위. 라우트 네임스페이스(`/insurance/*`)도 safelaby 기준. |
| `src/pages/ConsultationRoomPage.js` | **하이브리드 — Phase 3 머지** | safelaby UI 마크업 유지 + safelab의 `askAboutClause` 챗봇 + STT debounce + Azure echo cooldown 이식. 라우트는 `/insurance/summary/${roomId}`. |
| `src/pages/AdminDashboardPage.js` | **하이브리드 — Phase 3 머지** | safelaby UI 마크업 유지 + safelab의 `useEffect` fetch + `looksValid` 가드 + KPI ?? fallback 패턴 이식. |
| 모든 `*.css` (페이지별) | **safelaby 그대로** | UI 결정. |

### 2-3. 신규 라우트 / 사라지는 라우트

| safelaby 라우트 | 유지/삭제 |
|---|---|
| `/`, `/landing`, `/student/department`, `/student/safety/:dept`, `/student/safety/:dept/scenario/:sid`, `/student/safety/:dept/quiz/:sid`, `/student/safety/:dept/certificate` | 모두 유지 |
| `/admin/login`, `/admin` | 유지 |
| `/emergency`, `/incident/photo` | 유지 (`/incident/photo`는 신규 — 보존) |
| `/insurance/consult`, `/insurance/room/:roomId`, `/insurance/summary/:roomId` | 유지 |

safelab의 구식 라우트(`/room/:id`, `/summary/:id`, `/device-check`)는 **삭제** (이미 safelaby가 `/insurance/*`로 정리).

---

## 3. 단계별 실행 순서

각 Phase 끝에 git commit. 모든 작업은 `safelab-merged/`(신규) 안에서.

### Phase 0 — 준비 (5분)
1. `c:/Users/youns/바탕 화면/ai_cap/safelaby/` → `c:/Users/youns/바탕 화면/ai_cap/safelab-merged/` 전체 복사 (robocopy 권장).
2. `safelab-merged/`에서 `git init` + `.gitignore`(node_modules, build, .env*) → 초기 커밋 `chore: import safelaby baseline`.
3. `safelab-merged/insurtech-frontend-final/`에서 `npm install` 한 번 — 베이스라인이 빌드되는지 확인.
4. `safelab-merged/adjuster-system/`에서 `./gradlew build -x test` — 베이스라인 빌드 확인.

### Phase 1 — 백엔드 통째 교체 (10분)
1. `safelab-merged/adjuster-system/` 디렉토리를 통째로 `safelab/adjuster-system/`로 덮어쓰기. (단 safelaby `INVESTOR_REPORT.md`는 `docs/`로 이동 후 보존 — 결정 ②에 따름.)
2. `./gradlew clean build -x test` — 컴파일 확인.
3. (옵션) `./gradlew test` — 단위 테스트 통과.
4. commit: `feat(backend): adopt safelab — admin accident/incident/pending APIs + CORS`.

### Phase 2 — 프론트 서비스 / 데이터 / 컴포넌트 이식 (20분)
파일 단위로 safelab → safelab-merged 복사:

1. `services/api.js` ← safelab.
2. `services/gemini.js` ← safelab. `LAB_SAFETY_CONTEXT` import 경로가 `safelaby`의 `data/labsafetyExcerpt.js`와 일치하는지 확인 (이미 동일할 가능성 큼).
3. `services/tts.js` ← safelab. Azure env vars 미설정 시 자동 폴백 검증.
4. `data/adminMockStats.js` ← safelab.
5. `components/EmergencyFab.js` ← safelab. (CSS는 safelaby 보존.)
6. commit: `feat(frontend/services): adopt safelab — gemini-2.5, Azure TTS, safety admin APIs`.

### Phase 3 — 하이브리드 페이지 머지 (40분, 가장 위험)

#### 3-A. AdminDashboardPage.js
**베이스: safelaby 버전.** safelab의 다음 블록만 이식:
- `import { ACCIDENT_TYPE_COLOR, ACCIDENT_DISTRIBUTION_FALLBACK, RECENT_INCIDENTS_FALLBACK, PENDING_STUDENTS_FALLBACK }` (safelab 명명)
- `useState(*_FALLBACK)` 3개 추가
- `serverData` 안전 검증 (`looksValid` — `completionRate`가 `number`인지)
- 두 번째 `useEffect` — `safetyApi.getAccidentDistribution / getRecentIncidents / getPendingStudents` 3개 병렬 호출 + fallback 유지
- KPI 폴백 (`?? ADMIN_KPI.*`)
- `accidents.map`, `incidents.map`, `pending.map`로 정적 참조 → state로 치환
- 색상 인라인 → `ACCIDENT_TYPE_COLOR[a.type] || '#6B7280'`
- `serverStatus` 메시지 텍스트 — safelab 문구 채택

**보존**: `aurora-orb`, `<AppShell>`, `glass-card`, 전체 JSX 구조 — safelaby 그대로.

검증: 백엔드 가동/미가동 두 케이스 모두에서 화면 정상.

#### 3-B. ConsultationRoomPage.js
**베이스: safelaby 버전.** safelab의 다음 블록만 이식:
- `import { askAboutClause }` 추가 (`gemini.js`에 이미 존재해야 함 — Phase 2에서 보장).
- `chatDebounceRef`, `pendingChatRef`, `isChattingRef`, `isSpeakingRef` 4개 ref 추가.
- `speakAsAvatar`에 echo cooldown 800ms 추가.
- `triggerClauseChat` 함수 신설.
- `onTranscript` (또는 STT 콜백) 안에 debounce 1.6s 후 `triggerClauseChat` 호출 추가.
- cleanup에서 `clearTimeout(chatDebounceRef.current)` 추가.
- 컨트롤 바에 "🚨 긴급" 버튼 (옵션 — UI 결정에 어긋나지 않으면 추가).

**보존**: `<AppShell variant="room-shell" noFrame>`, 라우트 `/insurance/summary/${roomId}` — safelaby 그대로.

검증: 챗봇 자동 응답이 제대로 트리거되고, AI 발화 중 STT echo가 챗봇을 또 트리거하지 않는지 확인.

7. commit: `feat(pages): adopt safelab admin fetch + clause chatbot — preserve safelaby UI`.

### Phase 4 — 보조 자료 결정 (10분)
사용자 결정 필요 (§4 참고):
- safelab `docs/` (발표자료·보고서) 가져올지
- safelab `scripts/cloudtype-seed.sql` 가져올지
- safelab `setup/` (env 샘플) 가져올지
- safelaby `CLAUDE.md` 보존할지

가져오는 항목은 `safelab-merged/`의 적절한 위치에 복사 후 commit.

### Phase 5 — 검증 (30분)
1. `npm install` (필요 시 lock 파일 갱신).
2. `npm start` — 모든 라우트 수동 점검 (CLAUDE.md 라우트 표).
3. `CI=true npm run build` — 컴파일 에러 0.
4. **백엔드 미가동** + `/admin` → fallback mock 으로 그림.
5. **백엔드 가동** + `/admin` → 실제 응답으로 그림.
6. `/insurance/room/test` 진입 → 챗봇이 STT 인식 후 자동 응답하는지.
7. `/incident/photo` → 사진 업로드 + AI 분석 결과 표시.
8. `/landing` → Tailwind 격리(.landing-root) 정상.
9. EmergencyFab — `/`, `/emergency`, `/admin/login`, `/insurance/*`에서 안 보이는지.

### Phase 6 — 정리 (10분)
1. README.md 작성 — 통합 후 디렉토리 트리, 실행 방법, 환경 변수.
2. CLAUDE.md 갱신 — 페이지 ✅/⚠️ 표 갱신.
3. 최종 commit + 태그 `v1.0-merged`.

---

## 4. 진행 전 사용자 확정 필요 사항 (Open Questions)

| # | 질문 | 기본값 (이유) |
|---|---|---|
| ① | safelab `docs/` (발표자료·보고서·pptx) 가져올지? | **가져옴** — 기능과 무관하지만 팀 자료. `safelab-merged/docs/`로. |
| ② | safelaby `INVESTOR_REPORT.md` (백엔드 폴더 내) 처리? | **`safelab-merged/docs/`로 이동** — 백엔드 빌드와 무관. |
| ③ | safelab `scripts/cloudtype-seed.sql` 가져올지? | **가져옴** — DB 초기 시드. |
| ④ | safelab `setup/{application-local.yml, frontend.env.local}` 가져올지? | **가져옴 (단 .env 파일은 .gitignore 처리)** — 운영 시 필요. |
| ⑤ | safelaby `CLAUDE.md` 보존? | **보존** — Claude 핸드오프 문서. 페이지 표 등 갱신만. |
| ⑥ | 결과 폴더에서 `.git`을 새로 시작? 아니면 safelaby의 git history 이식? | **새로 시작** — clean. (safelaby가 worktree 라 history 이식이 까다로움.) |

---

## 5. 위험 요소 / 사전 차단

| 위험 | 차단 |
|---|---|
| safelaby의 Aurora UI가 safelab CSS로 덮여 깨짐 | **CSS·JSX 마크업은 절대 safelab에서 가져오지 않는다.** Phase 3는 데이터 훅·useEffect·ref·콜백만 이식. 마크업 줄바꿈 한 줄도 건드리지 않는다. |
| `gemini.js`의 `LAB_SAFETY_CONTEXT` import 경로 깨짐 | safelab의 `gemini.js`가 `../data/labsafetyExcerpt`를 참조하는지 확인 후 옮기기. |
| `tts.js` Azure env vars 누락 시 무음 | `isAzureConfigured()` 체크 후 자동 폴백 — safelab 코드에 이미 구현. 다만 Phase 5 #6에서 명시 검증. |
| `App.js`에 safelab 코드를 잘못 합쳐 라우트 충돌 | **App.js는 safelaby 원본 그대로.** safelab의 `/room/:id` 등은 가져오지 않는다. |
| `EmergencyFab` hideOn에 safelaby 라우트 누락 | safelab 코드 그대로 들여와 `/insurance/*` 가드는 이미 있음. `/incident/photo`도 hideOn에 추가할지 점검 (사진 신고 페이지 안에서 119 버튼이 따로 있다면 가림). |
| `adminMockStats.js` 키 명명 변경 후 import 사이트 빠뜨림 | `git grep -n "ACCIDENT_DISTRIBUTION\|RECENT_INCIDENTS\|PENDING_STUDENTS"` 로 모든 import 사이트 찾아 명명 통일. |
| Tailwind config 누락으로 `/landing` 깨짐 | `tailwind.config.js`, `postcss.config.js`, `index.css`(Tailwind directives) 3개 파일을 Phase 0 복사 시 명시적으로 확인. |
| 한글 경로 + Windows 권한 이슈 | robocopy + 파워셸 관리자 모드 권장. |
| 백엔드 SafetyService 머지 시 메서드 누락 | safelab 통째로 채택하므로 머지 자체가 없음 (Phase 1). 단 safelaby 쪽에 safelab엔 없는 비밀 메서드가 있는지 한 번 더 grep. |
| Azure key 등 시크릿이 git에 들어감 | `.gitignore`에 `.env*`, `setup/frontend.env.local`, `setup/application-local.yml` 명시. |

---

## 6. 시간 추정

| Phase | 예상 |
|---|---|
| 0. 준비 (복사·init·베이스라인 빌드) | 5분 |
| 1. 백엔드 통째 교체 | 10분 |
| 2. 프론트 서비스/데이터/컴포넌트 (5개 파일 복사) | 20분 |
| 3. 하이브리드 페이지 머지 (Admin + ConsultationRoom) | 40분 |
| 4. 보조 자료 결정·복사 | 10분 |
| 5. 검증 (수동 라우트 점검 포함) | 30분 |
| 6. 정리 (README·CLAUDE.md·태그) | 10분 |
| **총** | **~2시간 5분** |

---

## 7. 다음 액션

1. 사용자 — §4 Open Questions ①–⑥ 답변 (또는 "기본값으로 진행" 한 마디).
2. 답변 받는 즉시 Phase 0부터 자동 실행. Phase 3 시작 전에는 한 번 더 확인.

---

## 부록 A — 파일 단위 출처 매트릭스 (조회용)

```
safelab-merged/
├── adjuster-system/                 ← safelab 통째
├── insurtech-frontend-final/
│   ├── package.json                 ← safelaby (deps 우위)
│   ├── tailwind.config.js           ← safelaby
│   ├── postcss.config.js            ← safelaby
│   ├── public/                      ← safelaby
│   └── src/
│       ├── App.js                   ← safelaby
│       ├── index.js                 ← safelaby
│       ├── index.css                ← safelaby
│       ├── styles/
│       │   ├── global.css           ← safelaby
│       │   └── theme.css            ← safelaby
│       ├── components/
│       │   ├── AppShell.js          ← safelaby
│       │   ├── PageHeader.js        ← safelaby
│       │   ├── EmergencyFab.js      ← safelab (가드 우위)
│       │   ├── EmergencyFab.css     ← safelaby
│       │   └── landing/             ← safelaby (전부)
│       ├── data/
│       │   ├── adminMockStats.js    ← safelab (FALLBACK 네이밍)
│       │   ├── departments.js       ← safelaby
│       │   ├── incidentTypes.js     ← safelaby (신규)
│       │   ├── labsafety.js         ← safelaby (신규)
│       │   ├── labsafetyExcerpt.js  ← safelaby (≈ safelab)
│       │   ├── landing.js           ← safelaby (신규)
│       │   ├── scenarios.js         ← safelaby
│       │   ├── riskKeywords.js      ← safelaby
│       │   ├── emergencyCommon.js   ← safelaby
│       │   └── demoScripts.js       ← safelaby
│       ├── hooks/
│       │   ├── useToast.js          ← safelaby (신규)
│       │   └── useWebRTC.js         ← safelaby
│       ├── services/
│       │   ├── api.js               ← safelab (admin 메서드)
│       │   ├── gemini.js            ← safelab (2.5-flash + 챗봇)
│       │   ├── incidentVision.js    ← safelaby (신규)
│       │   ├── tts.js               ← safelab (Azure)
│       │   ├── riskDetector.js      ← safelaby (≈ safelab)
│       │   └── scenarioMatcher.js   ← safelaby (≈ safelab)
│       └── pages/
│           ├── ConsultationRoomPage.js   ← 하이브리드 (safelaby UI + safelab 챗봇)
│           ├── AdminDashboardPage.js     ← 하이브리드 (safelaby UI + safelab fetch)
│           ├── IncidentPhotoPage.{js,css}← safelaby (신규)
│           ├── SafetyLandingPage.jsx     ← safelaby (신규)
│           └── 그 외 모든 페이지         ← safelaby
├── docs/                            ← safelab + safelaby INVESTOR_REPORT.md
├── scripts/                         ← safelab
├── setup/                           ← safelab (.env류는 gitignore)
├── README.md                        ← 신규
└── CLAUDE.md                        ← safelaby (갱신)
```

## 부록 B — 검증 체크리스트 (Phase 5 인쇄용)

- [ ] `npm install` 성공
- [ ] `npm start` 성공, http://localhost:3000 진입
- [ ] `CI=true npm run build` warning 외 에러 0
- [ ] `./gradlew build` 성공
- [ ] `/` (EntryPage) 로딩
- [ ] `/landing` (SafetyLandingPage) Tailwind 정상
- [ ] `/student/department` 학과 선택 → 라우팅
- [ ] `/student/safety/chem` (또는 다른 학과) 허브
- [ ] `/student/safety/chem/scenario/:sid` 시나리오
- [ ] `/student/safety/chem/quiz/:sid` 퀴즈
- [ ] `/student/safety/chem/certificate` 인증서
- [ ] `/admin/login` (admin / admin1234)
- [ ] `/admin` 백엔드 가동 시 실 데이터, 미가동 시 mock
- [ ] `/emergency` 119 즉시 호출 + 사진 신고 버튼
- [ ] `/incident/photo` 카메라 + Gemini Vision 또는 mock
- [ ] `/insurance/consult` (DeviceCheck) 카메라/마이크
- [ ] `/insurance/room/test123` STT + 챗봇 자동 응답
- [ ] `/insurance/summary/test123` 분석 요약
- [ ] EmergencyFab — `/`, `/emergency`, `/admin/login`, `/insurance/*`에서 안 보임
- [ ] Aurora orb 4개가 모든 페이지에 떠 있음
- [ ] glass-card 디자인 일관성 유지

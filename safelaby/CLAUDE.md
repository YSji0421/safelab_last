# SafeLab — Claude 세션 핸드오프

> 새 컨텍스트 창에서 이 프로젝트 작업을 이어갈 때 가장 먼저 읽으세요.

## 프로젝트 한 줄 요약

**인하공전 인슈어테크 팀**의 2026 학교 경진대회 출품작 — 「연구실안전공제」(한국교육시설안전원, 「연구실 안전환경 조성에 관한 법률」 제26조) 약관을 RAG 시드로 한 **연구실 안전교육 + 공제 가입·청구** 통합 React 웹앱.

## 즉시 실행

사용자 메인 경로:
```
C:\Users\user\OneDrive - 인하공업전문대학\바탕 화면\itc2026\팀플\이예진지윤석
```

```cmd
cd /d "C:\Users\user\OneDrive - 인하공업전문대학\바탕 화면\itc2026\팀플\이예진지윤석\insurtech-frontend-final"
npm install        # 첫 실행 시
npm start
```

브라우저: <http://localhost:3000/>

> **주의**: dev server가 한 단계만 들어갑니다 — 예전 nested `insurtech-frontend/` 폴더는 정리되어 더 이상 없음. cd 한번만.

start 스크립트는 `cross-env HOST=localhost DANGEROUSLY_DISABLE_HOST_CHECK=true react-scripts start`로 박혀 있어 CRA 5 + WDS 4 allowedHosts 호환성 이슈는 자동 우회.

## Git 워크플로우

이 저장소는 **git worktree**를 사용합니다.

| 위치 | 브랜치 |
|---|---|
| `이예진지윤석/` (메인) | `main` |
| `이예진지윤석/.claude/worktrees/clever-ritchie-284fdd/` | `claude/clever-ritchie-284fdd` |

원격: `https://github.com/31620cm-sudo/safelab.git` (origin)

작업 패턴 (Claude 세션이 따라야 할 흐름):
1. **워크트리에서 코드 변경** → `git add` → `git commit`
2. **main에 fast-forward 머지**:
   ```bash
   MAIN="/c/Users/user/OneDrive - 인하공업전문대학/바탕 화면/itc2026/팀플/이예진지윤석"
   git -C "$MAIN" merge --ff-only claude/clever-ritchie-284fdd
   ```
3. (사용자가 명시적으로 요청하면) **push**:
   ```bash
   git -C "$MAIN" push origin main
   ```

> 사용자가 push 요청 안 하면 push 금지. commit + 머지까지만.

## 폴더 구조 (메인 경로 기준)

```
이예진지윤석/
├── insurtech-frontend-final/   ← React 프론트엔드 (메인 데모)
├── adjuster-system/            ← Spring Boot 백엔드 (선택, 미가동 시 mock)
├── .claude/
│   ├── labsafety_pact.txt          ← 「연구실안전공제」 RAG 원문
│   ├── labsafety_pact2.txt
│   ├── labsafety_pact_fitz.txt     ← PyMuPDF 추출본 (가장 깔끔)
│   ├── settings.local.json
│   └── worktrees/clever-ritchie-284fdd/  (git worktree)
├── .git, .github, .gitignore
└── CLAUDE.md (이 문서)
```

### `insurtech-frontend-final/src/`

```
src/
├── App.js                      ← 모든 라우트 정의
├── index.js                    ← global.css → theme.css → index.css 순 import
├── index.css                   ← Tailwind directives + brand 변수 (랜딩 전용)
├── pages/                      ← 16개 페이지
│   ├── EntryPage                       /  진입 분기
│   ├── SafetyLandingPage.jsx           /landing  외부 소개 (Tailwind 격리)
│   ├── DepartmentSelectPage            /student/department  (학과 선택)
│   ├── SafetyMainPage                  /student/safety/:dept  (허브)
│   ├── SafetyScenarioPage              /student/safety/:dept/scenario/:sid
│   ├── SafetyQuizPage                  /student/safety/:dept/quiz/:sid
│   ├── CertificatePage                 /student/safety/:dept/certificate
│   ├── AdminLoginPage                  /admin/login (admin / admin1234)
│   ├── AdminDashboardPage              /admin
│   ├── EmergencyPage                   /emergency
│   ├── IncidentPhotoPage               /incident/photo  ← 사진 → AI 사고 인식
│   ├── DeviceCheckPage                 /insurance/consult
│   ├── ConsultationRoomPage            /insurance/room/:roomId  (화상상담, 풀화면)
│   └── SummaryPage                     /insurance/summary/:roomId
├── components/
│   ├── AppShell.js             ← 페이지 wrapper (Aurora orb + mobile-frame)
│   ├── PageHeader.js           ← sticky 페이지 헤더 (←뒤로 + 제목 + 우측)
│   ├── EmergencyFab.js         ← 우하단 긴급 FAB (모든 라우트)
│   └── landing/                ← 랜딩 전용 (Header/Hero/About/Lineup/ContactForm/Footer/SmartLink)
├── data/                       ← 모든 시드 데이터 (단일 소스)
│   ├── departments.js              학과 (chem/mech/elec/comp) + 시나리오 + 긴급연락처
│   ├── scenarios.js                사고 시나리오 + 약관 매핑
│   ├── labsafetyExcerpt.js         약관 핵심 발췌 (Gemini 컨텍스트)
│   ├── labsafety.js                RAG 시드 (BENEFITS/SCENARIOS/EXCLUSIONS)
│   ├── incidentTypes.js            사진 사고 인식 7개 유형 카탈로그
│   ├── adminMockStats.js           관리자 대시보드 mock
│   ├── demoScripts.js              시연 상담 대본
│   ├── riskKeywords.js             리스크 키워드
│   ├── emergencyCommon.js          공통 긴급연락처
│   └── landing.js                  랜딩 카피·메뉴·라우트
├── hooks/
│   ├── useToast.js             ← 랜딩 Toast (Context)
│   └── useWebRTC.js
├── services/
│   ├── gemini.js                   상담 분석 (텍스트)
│   ├── incidentVision.js           사진 → 사고 분류 (Gemini 1.5 Flash multimodal + mock fallback)
│   ├── api.js · riskDetector.js · scenarioMatcher.js · tts.js
└── styles/
    ├── global.css                  글로벌 reset (보존)
    └── theme.css                   ★ 디자인 토큰 단일 소스
```

## 디자인 시스템 (theme.css 토큰 — 모든 페이지가 따름)

| 카테고리 | 클래스 / 변수 |
|---|---|
| **셸** | `.app-shell` + `.aurora-orb o1~o4` (4개 떠다니는 글로우) + `.mobile-frame` (max-width 1240px 데스크톱 폭) |
| **컬러** | `--ink` `--ink-2` `--ink-3` `--ink-mute` 텍스트 / `--bg` `--bg-2` `--bg-3` 배경 / `--line` `--line-2` 보더 |
| **글래스** | `--glass-strong` `--glass-blur` `.glass-card` `.glass-blur-strong` |
| **Aurora** | `--aurora-pink` `--aurora-blue` `--aurora-purple` `--aurora-mint` `--aurora-peach` |
| **버튼** | `.t-btn` + `.t-btn-primary` (검정) / `.t-btn-ghost` / `.t-btn-block` |
| **칩/배지** | `.pill` + `.pill-red` `.pill-green` `.pill-blue` `.pill-rose` `.pill-orange` `.pill-gray` |
| **헤더/본문** | `.page-header` (sticky 60-1fr-60 grid) / `.page-body` |
| **반경** | `--r-sm` 12 / `--r-md` 18 / `--r-lg` 24 / `--r-xl` 32 / `--r-2xl` 40 |
| **그림자** | `--shadow-sm` `--shadow-md` `--shadow-elev` |

새 페이지는 위 토큰을 그대로 써야 통일감 유지. 절대 다크 색상이나 새 색 hex 직참조 금지.

### 페이지 헤더 패턴 (모든 라우트)

```jsx
<div className="app-shell">
  <div className="aurora-orb o1" />
  <div className="aurora-orb o2" />
  <div className="aurora-orb o3" />
  <div className="aurora-orb o4" />
  <div className="mobile-frame ?-frame">  {/* ?-frame 자체 background는 transparent */}
    <header className="?-header">  {/* sticky, glass-strong */}
      <button className="?-back" onClick={...}>←</button>
      <h1>...</h1>
    </header>
    <main className="?-main">  {/* max-width 1100px 내외 가운데 정렬 */}
      <section>
        <span className="eyebrow">Step 1</span>
        <h2>섹션 제목</h2>
        <p>부제</p>
      </section>
      ...
    </main>
  </div>
</div>
```

랜딩(`/landing`)만 Tailwind를 격리(`important: '.landing-root'` + `corePlugins.preflight: false`)해서 사용. 다른 페이지에서 Tailwind 클래스 절대 금지.

## 환경 변수

| 변수 | 용도 |
|---|---|
| `REACT_APP_GEMINI_API_KEY` | Gemini 1.5 Flash API 키. 미설정이면 자동으로 mock fallback (시연 가능) |

설정 위치: `insurtech-frontend-final/.env.local` (gitignored). 또는 Vercel env vars.

## 자주 수정하는 파일

| 변경하고 싶은 것 | 파일 |
|---|---|
| 학과 추가/수정 (chem/mech/elec/comp) | `src/data/departments.js` |
| 사고 시나리오 + 약관 매핑 | `src/data/scenarios.js` |
| 약관 발췌 (Gemini 컨텍스트) | `src/data/labsafetyExcerpt.js` |
| 사진 사고 유형 / 즉시 조치 / 보장 | `src/data/incidentTypes.js` |
| 관리자 대시보드 mock 데이터 | `src/data/adminMockStats.js` |
| 시연 상담 대본 | `src/data/demoScripts.js` |
| 랜딩 카피·메뉴·카드 매핑 | `src/data/landing.js` |
| 컬러/폰트/반경/그림자 토큰 | `src/styles/theme.css` |
| 라우트 추가/수정 | `src/App.js` |
| 모든 페이지 셸 | `src/components/AppShell.js` |
| 페이지 헤더 | `src/components/PageHeader.js` |
| Gemini API 키 | `src/services/gemini.js` (`GEMINI_API_KEY`) |

## 디자인 통일 작업 진행 상황

이미 라이트 Aurora 톤으로 통일된 페이지 (✅) / 아직 점검 안 된 페이지 (⚠️):

- ✅ EntryPage
- ✅ SafetyLandingPage (Tailwind 격리, Bento grid)
- ✅ DepartmentSelectPage (데스크톱 웹 톤 — Step 1/2 + 2x2 grid + sticky CTA)
- ✅ AdminLoginPage (데스크톱 split — 좌 인포 패널 + 우 로그인 카드)
- ✅ EmergencyPage (3-col grid + 검정 헤더 + 119 빨간 즉시 호출 박스)
- ✅ DeviceCheckPage (AppShell + glass-card)
- ✅ SummaryPage (AppShell + glass-card)
- ✅ ConsultationRoomPage (다크 → 라이트 Aurora 전환)
- ✅ IncidentPhotoPage (신규 — 사진 사고 인식, webcam 촬영)
- ⚠️ SafetyMainPage (점검 미흡, 모바일 디자인일 가능성)
- ⚠️ SafetyScenarioPage (점검 미흡)
- ⚠️ SafetyQuizPage (점검 미흡)
- ⚠️ CertificatePage (점검 미흡 — 인증서는 인쇄용 디자인이라 일부 보존)
- ⚠️ AdminDashboardPage (점검 미흡 — 데이터 dashboard 패턴 별도)

다음 세션에서 사용자가 보낸 화면 또는 요청에 따라 이 페이지들도 데스크톱 웹 톤(eyebrow + h2 + grid 패턴)으로 정리할 가능성.

## 최근 commit 히스토리 (역순)

```
8c9c7ef  feat: IncidentPhotoPage 에 데스크톱 webcam 직접 촬영 추가
b15b38b  feat: 사진 → AI 사고 인식 페이지 (Gemini Vision + mock fallback)
06f07a1  feat: EmergencyPage, AdminLoginPage 데스크톱 웹 레이아웃으로 재구성
8953bbe  feat: Hero를 Bento grid 톤으로 재구성 (Linear/Vercel 풍)
e57f026  feat: DepartmentSelectPage 데스크톱 웹 레이아웃으로 리디자인
858cb9e  style: 모든 페이지에 Aurora orb 4개 동기화
51c4bd9  style: ConsultationRoomPage 다크 → 라이트 Aurora 톤
439d574  revert+style: 모바일 frame(480px) 제거, 데스크톱 웹 폭(1240px)으로 통일
468291b  feat: 모든 라우트에 공통 AppShell + PageHeader 적용
798802d  feat: SafetyLandingPage를 진짜 데모 프로젝트(inner)로 이전
753a6b7  chore: 발표자료 / 보고서 / pptx 빌드 스크립트 모두 제거
ea049ff  chore: 프로젝트 폴더 구조 정리 — outer 잔재 제거 + inner를 outer 위치로 promote
```

전체: `git -C MAIN log --oneline -25`

## 자주 쓰는 명령

```bash
# 워크트리 위치 (Claude 세션이 보통 여기에 있음)
cd /c/Users/user/OneDrive\ -\ 인하공업전문대학/바탕\ 화면/itc2026/팀플/이예진지윤석/.claude/worktrees/clever-ritchie-284fdd

# 빌드 검증
(cd insurtech-frontend-final && CI=true npm run build 2>&1 | grep -E "Compiled|Failed|error|Error|warning" | head -10)

# commit + main ff merge
git add -A
git commit -m "..."
MAIN="/c/Users/user/OneDrive - 인하공업전문대학/바탕 화면/itc2026/팀플/이예진지윤석"
git -C "$MAIN" merge --ff-only claude/clever-ritchie-284fdd

# 사용자가 명시 요청 시에만 push
git -C "$MAIN" push origin main
```

## 사용자 메모

- 학교: 인하공전 (인하공업전문대학)
- 팀: 인슈어테크 (이예진, 지윤석)
- 컨텍스트: 2026 학교 경진대회, 1주 데모 급행, 공대 실험실/학생 단체보험 특화
- 사용자 한국어 모국어 (모든 답변·카피·commit 메시지 한국어)
- 컴퓨터 OS: Windows + Git Bash (Cygwin paths). cmd 명령은 `cd /d "..."` 형식.
- OneDrive 경로 + 한글 폴더명 — 일부 도구가 한글 경로에 약함, 권한 거절 / file lock 자주 발생

# SafeLab — Claude 세션 핸드오프

> 새 컨텍스트 창에서 이 프로젝트 작업을 이어갈 때 가장 먼저 읽으세요.
> **마지막 업데이트**: 폴더 구조 한 단계 깊어짐 (`safelab-merged/` wrapper) + 배포 repo 변경.

## 프로젝트 한 줄 요약

**인하공전 인슈어테크 팀**(이예진·지윤석)의 2026 학교 경진대회 출품작 — 「연구실안전공제」(한국교육시설안전원, 「연구실 안전환경 조성에 관한 법률」 제26조) 약관 + 「2026 대학안전관리계획」 + 「2026 안전교육자료」를 RAG 시드로 한 **연구실 안전교육 + 공제 가입·청구** 통합 React 웹앱.

## ⚠️ 폴더 구조가 한 단계 깊어졌습니다

지윤석님의 백엔드 통합 작업으로 모든 코드가 `safelab-merged/` 안으로 이동했습니다.

```
이예진지윤석/                       ← 워크스페이스 루트 (사용자 OneDrive 위치)
├── .claude/                        ← Claude 세션 자료 (gitignored)
│   ├── labsafety_pact*.txt             ← 약관 RAG 원문
│   ├── settings.local.json
│   └── worktrees/upbeat-wright-21b932/ ← git worktree (옛 main 기반, stale)
├── .git/                           ← safelab-last/master 추적
├── .github/
└── safelab-merged/                 ★ 실제 코드는 여기부터 ★
    ├── CLAUDE.md                       (옛 버전 — 이 파일이 더 최신)
    ├── README.md
    ├── adjuster-system/                ← Spring Boot 백엔드
    ├── insurtech-frontend-final/       ← React 프론트엔드 (메인 데모)
    │   └── src/
    ├── docs/
    ├── scripts/
    └── setup/
```

## 즉시 실행

사용자 메인 경로:
```
C:\Users\user\OneDrive - 인하공업전문대학\바탕 화면\itc2026\팀플\이예진지윤석
```

```cmd
cd /d "C:\Users\user\OneDrive - 인하공업전문대학\바탕 화면\itc2026\팀플\이예진지윤석\safelab-merged\insurtech-frontend-final"
npm install        # 첫 실행 또는 새로 받은 후
npm start
```

브라우저: <http://localhost:3000/>

> **첫 실행 npm install 5~10분 소요** — 새 폴더에 node_modules 없음.

## 배포 환경

| 종류 | 위치 | 비고 |
|---|---|---|
| **프론트엔드** | <https://safelab-last.vercel.app/> | Vercel 자동 배포 |
| **백엔드** | 클라우드타입 | younsuk0421@naver.com / aicap123 (꺼졌을 때 재시동용) |

## Git 워크플로우

### 원격 저장소

| 이름 | URL | 용도 |
|---|---|---|
| `safelab-last` (★ 메인) | `https://github.com/YSji0421/safelab_last.git` | **배포 repo** — push 시 Vercel + 클라우드타입 자동 배포 |
| `origin` (백업) | `https://github.com/31620cm-sudo/safelab.git` | 우리 옛 commit 백업 (이예진 작업 history). 더 이상 push 안 함 |

### 브랜치 추적

- `local main` → `safelab-last/master` 추적 (이미 설정됨)
- 새 repo의 default branch는 `master` (우리 local은 `main`이지만 같은 commit)
- `git pull` → safelab-last/master에서 가져옴
- `git push safelab-last main:master` → 배포 repo로 보냄 (자동 배포)

### 작업 패턴

1. 코드 변경 → `git add` → `git commit`
2. (사용자가 명시적으로 요청하면) `git push safelab-last main:master` → Vercel 자동 재배포

> 사용자가 push 요청 안 하면 push 금지. commit까지만.

## 페이지·라우트 (전체)

```
/                                     EntryPage 진입 분기
/landing                              SafetyLandingPage 외부 소개 (Tailwind 격리, Bento)
/student/department                   DepartmentSelectPage 학과 선택
/student/safety/:dept                 SafetyMainPage 허브
/student/safety/:dept/scenario/:sid   SafetyScenarioPage
/student/safety/:dept/quiz/:sid       SafetyQuizPage
/student/safety/:dept/certificate     CertificatePage
/safety/cases                         IncidentCasesPage ⭐ 「2026 안전교육자료」 사고사례 10건
/safety/msds                          MsdsLearnPage ⭐ MSDS 16항목 + GHS 9종 + 시약 5종
/admin/login                          AdminLoginPage (admin / admin1234)
/admin                                AdminDashboardPage
/emergency                            EmergencyPage (사고등급 가이드 + CPR/AED/소화기 카드)
/incident/photo                       IncidentPhotoPage 사진 → AI 사고 인식 + 4등급
/buildings                            BuildingSafetyPage ⭐ 캠퍼스 25개 동 안전등급
/insurance/consult                    DeviceCheckPage 보험 상담 시작
/insurance/room/:roomId               ConsultationRoomPage 화상상담 (마스코트 캐릭터)
/insurance/summary/:roomId            SummaryPage
/insurance/simulator                  InsuranceSimulatorPage ⭐ 4종 보험 보상 시뮬레이터
```

## 데이터 시드 (`src/data/`)

**우리(이예진) 작업 + 지윤석 보강 통합**

```
departments.js          학과 + 시나리오 + 학과별 긴급연락처 (지윤석 학과명 변경 반영)
scenarios.js            사고 시나리오 + 약관 매핑
labsafetyExcerpt.js     RAG 컨텍스트 — 약관 + 「대학안전관리계획」 + 「안전교육자료」
labsafety.js            RAG 시드 (BENEFITS/SCENARIOS/EXCLUSIONS)
incidentTypes.js        사진 사고 7유형 + 4등급(severity) + 신고 체인(reportingChain)
incidentCases.js        ⭐ PDF 사고사례 10건 (SE-2)
msds.js                 ⭐ MSDS 16항목 + GHS 9종 + 시약 5종 (SE-3)
buildings.js            ⭐ 캠퍼스 25개 동 + 안전인증 (D)
insurancePlans.js       ⭐ 4종 보험 보상한도 (C)
adminMockStats.js       관리자 KPI (실 학생 7,068명 등 PDF 기준)
emergencyCommon.js      공통 긴급연락처 (인하대병원 등 PDF 인용)
demoScripts.js          시연 상담 대본
riskKeywords.js         리스크 키워드
landing.js              랜딩 카피 + WHY_SAFELAB 통계 섹션
```

## 디자인 시스템 (theme.css 토큰 — 모든 페이지가 따름)

| 카테고리 | 클래스 / 변수 |
|---|---|
| **셸** | `.app-shell` + `.aurora-orb o1~o4` (4 글로우) + `.mobile-frame` (max 1240px) |
| **컬러** | `--ink` `--ink-2` `--ink-3` `--ink-mute` 텍스트 / `--bg`/`--bg-2`/`--bg-3` 배경 |
| **글래스** | `--glass-strong` `--glass-blur` `.glass-card` |
| **버튼** | `.t-btn` + `.t-btn-primary` (검정) / `.t-btn-ghost` |
| **칩/배지** | `.pill` + `.pill-red/green/blue/orange/gray` |
| **헤더/본문** | `.page-header` (sticky 60-1fr-60) / `.page-body` |

랜딩(`/landing`)만 Tailwind 격리(`important: '.landing-root'`). 다른 페이지에서 Tailwind 절대 금지.

## 환경 변수

| 변수 | 용도 |
|---|---|
| `REACT_APP_GEMINI_API_KEY` | Gemini 1.5 Flash. 미설정이면 mock fallback (시연 가능) |
| **CLOVA Voice TTS** | 지윤석님 추가 — 네이버 클라우드 키 필요 (백엔드 통신) |

설정 위치: `safelab-merged/insurtech-frontend-final/.env.local` (gitignored). 또는 Vercel env vars.

## 최근 진행 (역순)

### 지윤석 작업 (배포 통합)
- `c405ba8` tt
- `d77cb40` 사진 바꾸기 (학교 마스코트 캐릭터로 AI 상담사 변경)
- `a1b79ea` clov (CLOVA Voice TTS 도입)
- `7ffa3ba` nameu (학과 이름 변경)
- `912cd40` merged (백엔드 + 프론트 합치기 → safelab-merged/)
- `de5f613` fronend연결 (배포 오류 수정, API + DB)
- "2026 경진대회출품" 텍스트 삭제

### 이예진 작업 (이전 9개 패키지, 지윤석님이 그대로 가져감)
- SE-1~4: 「2026 안전교육자료」 PDF 통합 (사고사례·MSDS·CPR/AED 등)
- C: 보험 보상 시뮬레이터 (`/insurance/simulator`)
- D: 캠퍼스 25개 건물 안전등급 (`/buildings`)
- B: 사고등급(심각/경계/주의/관심) + 단계별 신고 가이드
- F+A+E: 「2026 대학안전관리계획」 PDF 데이터 통합 (실제 학교 7,068명·25동·4종 보험)

전체 history: `git -C MAIN log --oneline -25 safelab-last/master`

## 자주 쓰는 명령

```bash
MAIN="/c/Users/user/OneDrive - 인하공업전문대학/바탕 화면/itc2026/팀플/이예진지윤석"

# 빌드 검증
(cd "$MAIN/safelab-merged/insurtech-frontend-final" && CI=true npm run build 2>&1 | grep -E "Compiled|Failed|error|Error|warning" | head -10)

# commit
cd "$MAIN/safelab-merged/insurtech-frontend-final"
git add -A
git commit -m "..."

# 배포 push (사용자 명시 요청 시에만!)
git -C "$MAIN" push safelab-last main:master

# 배포 repo에서 최신 가져오기 (지윤석님 변경사항)
git -C "$MAIN" pull safelab-last master
```

## 워크트리 상태

`.claude/worktrees/upbeat-wright-21b932/` — **stale**.
- 옛 main(`f4cb5b1`) 기반으로 만들어져서 새 master(`c405ba8`)와 history가 분리됨
- 사용 시 충돌 발생 가능 → 새 워크트리 만들거나 정리 필요
- 정리 명령:
  ```bash
  git -C "$MAIN" worktree remove ".claude/worktrees/upbeat-wright-21b932"
  ```
  (열린 파일/dev server가 있으면 lock 발생할 수 있음 → 종료 후 시도)

## 주요 외부 자료 (PDF, .claude/ 안)

| 파일 | 용도 |
|---|---|
| `labsafety_pact_fitz.txt` | 「연구실안전공제」 약관 원문 (PyMuPDF 추출) |
| 「2026 대학안전관리계획」 (외부 OneDrive) | 실제 학교 통계·보험·건물 데이터 출처 |
| 「2026 안전교육자료」 (외부 OneDrive) | 사고사례 10건·MSDS·CPR/AED 출처 |
| (외부 카카오톡) 안전관리위원회 회의록 | 발표 후크 (학과당 2~3시간 부담 등) |

## 사용자 메모

- 학교: 인하공전 (인하공업전문대학)
- 팀: 인슈어테크 (이예진 — 본 세션 사용자, 지윤석 — 코드 통합·배포 담당)
- 컨텍스트: 2026 학교 경진대회, 1주 데모 급행
- 사용자 한국어 모국어 (모든 답변·카피·commit 메시지 한국어)
- 컴퓨터 OS: Windows + Git Bash (Cygwin paths). cmd 명령은 `cd /d "..."` 형식
- OneDrive 경로 + 한글 폴더명 — 일부 도구가 한글 경로에 약함, 권한 거절 / file lock 자주 발생
- **발표 자료**: `C:\Users\user\Downloads\SafeLab_발표.pptx` (8슬라이드, 회의록 후크 기반)

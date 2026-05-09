# SafeLab — 인하공전 연구실 안전 통합 플랫폼

「연구실 안전환경 조성에 관한 법률」 제26조 「연구실안전공제」 약관 기반 — AI 시나리오 + 약관 퀴즈로 학과별 안전교육과 손해사정 업무를 통합한 풀스택 시스템.

## 폴더 구조

```
safelab/
├── insurtech-frontend-final/insurtech-frontend/   # 프론트엔드 (React, Vercel 배포)
├── adjuster-system/                                # 백엔드 (Spring Boot, cloudtype 배포)
├── docs/                                           # 기획·발표·보고서
├── scripts/                                        # 일회성 스크립트·시드
└── setup/                                          # 로컬 개발 환경 템플릿
```

## 빠르게 띄우기

새로 클론한 경우 — [setup/README.md](setup/README.md) 참고.

```bash
# 프론트
cd insurtech-frontend-final/insurtech-frontend
npm install && npm start          # → http://localhost:3000

# 백엔드 (새 터미널)
cd adjuster-system
./gradlew.bat bootRun              # Windows
./gradlew bootRun                  # macOS / Linux  → http://localhost:8080
```

## 배포

| 영역 | 호스팅 | URL |
|---|---|---|
| 프론트 | Vercel | https://safelab-eight.vercel.app |
| 백엔드 | cloudtype | `https://port-0-safelab-mon2359z1706e4ba.sel3.cloudtype.app` |

배포 시크릿(Gemini API key, DB credentials, OPENAI key 등)은 각 호스팅 콘솔의 환경변수로 관리. 레포에 평문으로 두지 않음.

## 주요 동선

| 경로 | 역할 |
|---|---|
| `/` | 진입 분기 (학생 / 관리자) |
| `/student/department` | 학과 선택 → 안전교육 시작 |
| `/student/safety/:dept` | 시나리오 목록 + 진척도 |
| `/student/safety/:dept/scenario/:sid` | AI 1인칭 시나리오 4단계 |
| `/student/safety/:dept/quiz/:sid` | 약관 퀴즈 5문항 → 4↑ 이수 |
| `/student/safety/:dept/certificate` | 이수증 (PDF 인쇄) |
| `/admin/login` | 관리자 로그인 (`admin / admin1234`) |
| `/admin` | KPI · 학과별 이수율 · 미이수자 |
| `/emergency` | 긴급 연락처 (학과별 + 공통) |

## 폴더별 안내

### `insurtech-frontend-final/insurtech-frontend/`
React 18 + React Router v6. CRA 기반.
- 메인 페이지: [App.js](insurtech-frontend-final/insurtech-frontend/src/App.js)
- 백엔드 API 호출: [src/services/api.js](insurtech-frontend-final/insurtech-frontend/src/services/api.js) (`baseURL: '/api'`, dev 시 `package.json` 의 `proxy` 로 백엔드 라우팅)

### `adjuster-system/`
Spring Boot 3 + JPA + Spring Security + Thymeleaf.
- 손해사정 업무 풀스택 (사건·예약·상담·보고서·메일·QnA) — Thymeleaf SSR
- 안전교육 REST API (`/api/safety/*`) — Vercel 프론트와 연동
- WebRTC 시그널링 (`/ws/signal`)

### `docs/`
| 파일 | 내용 |
|---|---|
| `ADMIN_FIX_PLAN.md` | `/admin` 흰 화면 디버깅 기록 |
| `INVESTOR_REPORT.md` | 사업성 검토 |
| `SafeLab_발표자료.pptx` | 경진대회 발표 슬라이드 |
| `인하공전_AI상담시스템_*` | 옛 보험 상담 모듈 발표·보고서 |

### `scripts/`
| 파일 | 용도 |
|---|---|
| `build_ppt.js` | `node scripts/build_ppt.js` 로 발표 pptx 생성 |
| `cloudtype-seed.sql` | cloudtype MariaDB 에 시연 데이터 1회 시드 |

cloudtype 시드 사용 시 (raw URL 갱신됨):
```bash
\! curl -L -o /tmp/seed.sql https://raw.githubusercontent.com/YSji0421/safelab/main/scripts/cloudtype-seed.sql
source /tmp/seed.sql
```

### `setup/`
로컬 개발용 환경설정 템플릿. 실 시크릿은 비어 있음 — 자세한 내용은 [setup/README.md](setup/README.md) 참고.

## 기술 스택

- **프론트**: React 18, React Router v6, Axios, Google Gemini 1.5 Flash, Web Speech (STT/TTS), WebRTC
- **백엔드**: Spring Boot 3, Spring Security, JPA, MariaDB (cloudtype) / MySQL (로컬), H2 (테스트)
- **배포**: Vercel (프론트) + cloudtype (백엔드 + DB)
- **AI**: Google Gemini (시나리오·퀴즈 생성), OpenAI/Claude (상담 요약)

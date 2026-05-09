# SafeLab — 인하공전 연구실 안전 통합 플랫폼

## 팀: 인슈어테크 | 이예진, 지윤석 · 2026 학교 경진대회

「연구실 안전환경 조성에 관한 법률」 제26조에 근거한 **「연구실안전공제」** 약관을 베이스로,
공대 학과의 형식적인 안전교육을 **AI 시나리오 + 약관 기반 퀴즈**로 실효성 있게 만든 통합 플랫폼.

## 빠른 실행

### 프론트엔드
```bash
cd insurtech-frontend-final/insurtech-frontend
npm install     # 첫 실행 시
npm start
```
http://localhost:3000 접속.

### 백엔드 (선택 — 미실행 시 자동 mock 모드)
```bash
cd adjuster-system
./gradlew bootRun       # macOS/Linux
gradlew.bat bootRun     # Windows
```
프론트의 `package.json` `proxy` 설정으로 `/api/*` 가 자동 라우팅됩니다.

## 진입 흐름

```
/  EntryPage (관리자 / 학생 분기)
├── 학생 → /student/department → 학과 선택 (이름·학번)
│         → /student/safety/:dept → 시나리오 → 퀴즈 → 이수증
├── 관리자 → /admin/login (admin / admin1234)
│         → /admin → KPI · 학과별 이수율 · 사고 분포 · 미이수자 명단
└── 우하단 빨간 FAB → /emergency (학과별·공통 긴급연락처)
```

## 주요 화면

| 경로 | 설명 |
|---|---|
| `/` | 관리자/학생 진입 분기 (요구 1) |
| `/admin/login` | 관리자 로그인 (요구 2) |
| `/admin` | 학생 이수 현황 + 안전 대시보드 (요구 3) |
| `/student/department` | 학과 선택 (요구 5) |
| `/student/safety/:dept` | 학과별 안전교육 메인 |
| `/student/safety/:dept/scenario/:sid` | AI 1인칭 시나리오 |
| `/student/safety/:dept/quiz/:sid` | 약관 기반 5문항 퀴즈 |
| `/student/safety/:dept/certificate` | 이수증 (인쇄/PDF) |
| `/emergency` | 긴급 연락처 — 보험과 분리 (요구 4) |
| `/insurance/*` | 기존 보험 약관 상담 (분리된 부가 모듈) |

## Gemini API 연동 (선택)

1. https://aistudio.google.com 에서 API 키 발급 (무료)
2. `src/services/gemini.js` 상단의 `GEMINI_API_KEY` 값을 실제 키로 교체

미설정 상태에서도 8개 학과 시나리오 + 5문항 약관 퀴즈가 mock으로 동작합니다.

## 백엔드 API

| 엔드포인트 | 메서드 | 설명 |
|---|---|---|
| `/api/safety/courses/{deptId}` | GET | 학과별 시나리오/긴급연락처 |
| `/api/safety/courses` | GET | 전체 학과 목록 |
| `/api/safety/attempts` | POST | 학생 이수(퀴즈 통과) 기록 |
| `/api/safety/admin/progress` | GET | 관리자 대시보드 KPI + 학과별 진척 |

학생 흐름은 백엔드 미가동 시에도 localStorage로 진행되며, 가동 시 자동 동기화됩니다.

## 디자인 시스템

`src/styles/theme.css` 의 CSS 변수 토큰. 빨강(#E60000) + 화이트 카드의 모바일 우선 톤
(요구 6 — 첨부 Vodafone 풍 이미지 영감).

## 학과별 시연 컨텐츠

| 학과 | 시나리오 | 약관 매핑 |
|---|---|---|
| 화공환경과 | 황산 피부 접촉 / 유독가스 누출 | 제3조 ② 유독가스 흡입 중독 |
| 기계과 | 선반 끼임 / 그라인더 안구 비산 | 별표1 1~3급 (절단·시력) |
| 전기정보과 | 배전반 감전 / 분전반 화재 | 신경계 장해 / 화상 특약 |
| 컴퓨터정보과 | 서버실 UPS 화재 / 의식저하 | 화상 특약 / 응급 |

## 기술 스택

- **프론트**: React 18, React Router v6, Axios, Gemini 1.5 Flash
- **백엔드**: Spring Boot 3, Spring Security, JPA, H2 (개발)
- **베이스 약관**: 「연구실안전공제」 (한국교육시설안전원)

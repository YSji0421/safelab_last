# 투자 제안 보고서

## AI 기반 상담 운영 지원 플랫폼 — 1인 손해사정사·소규모 보험 실무자를 위한 업무 자동화

프로젝트 코드명: **Adjuster System**
작성 단계: **Seed / Demo MVP 완료 (phase 1)**

---

## 1. Executive Summary

**우리는 1인 손해사정사와 소규모 보험 실무자의 상담·문서·사후관리 업무를 하나의 화면에서 끝낼 수 있게 하는 "상담 운영 지원 플랫폼" 을 만들었습니다.**

기존 제품들이 주로 대형 보험사의 내부 업무 자동화에만 집중하는 반면, 우리는 **"혼자 일하는 손해사정사"** 라는 시장을 정면으로 겨냥합니다. 이들은 상담·서류·보고서·후속관리를 모두 혼자 처리하면서도, 경험이 적은 파트타임 인력이 투입되면 상담 품질이 급격히 떨어지는 구조적 문제를 안고 있습니다.

Phase 1 MVP (데모 완료)는 다음을 제공합니다.

- **실시간 상담 도움 패널** — 상담 내용을 타이핑하는 순간 추천 질문 / 누락 체크리스트 / 필요 서류 / 주의사항이 실시간 갱신 (사고유형·키워드 매칭 기반)
- **Q&A 지식베이스** — 13종 시드 + DB 확장형 FAQ
- **상담 요약 이메일 자동 발송** — 원클릭 미리보기 → Mock 발송 → 감사 로그 자동 기록
- **상담 예약 관리** — 예약 등록 → 확정 → 사건 자동 전환까지 단일 흐름
- **기존 기능 유지** — 사건 CRUD / AI 요약 / 키워드 추출 / 보고서 초안 생성 / 이력 타임라인

**실행 증거**: 단일 Spring Boot 3.2 프로젝트 내에 14개 티켓이 모두 코드로 구현되어 있으며, H2 in-memory DB + seed 로 5초 내에 풀 데모가 기동됩니다. `feature.mail.sender`, `feature.help.engine` 스위치로 Phase 2 (실제 SMTP·LLM) 전환 경로가 아키텍처 레벨에서 이미 확보되어 있습니다.

---

## 2. 문제 정의 — 왜 지금 이 시장인가

### 2-1. 1인·소규모 손해사정 실무의 구조적 통증

한국의 보험손해사정 시장은 대형 손해사정법인과 함께 **개인 사정사·소규모 법인**이 실질적 상담·서류·보고서 업무의 상당 부분을 담당합니다. 이들이 겪는 통증은 세 가지로 압축됩니다.

1. **상담 품질의 편차**
   - 같은 사고유형이라도 경력에 따라 질문 깊이가 다름
   - 후유장해, 기왕증, 과실비율 등 **놓치면 보상액이 수백만~수천만 원 단위로 달라지는** 체크 항목이 즉흥적 기억에 의존
   - 파트타임/신입 투입 시 상담 품질이 급격히 저하

2. **반복·수작업으로 인한 누락 리스크**
   - 상담 → 서류 안내 → 진단서 수령 → 보고서 작성 → 지급 추적이 **다른 도구 · 다른 양식 · 다른 채널** 에 분산
   - "카카오톡으로 안내 → 전화로 재안내 → 이메일로 한번 더" 식 3중 안내가 일반화
   - 필요 서류 누락 → 지급 지연 → 고객 불만

3. **사전 예약 · 사후 후속 관리의 부재**
   - 사건 등록 "이전 단계" (상담 예약) 가 달력/수첩에서만 관리
   - 사건 종료 "이후" 의 고객 커뮤니케이션(요약 이메일·다음 단계 안내) 이 거의 비공식적으로 처리

### 2-2. 왜 기존 툴이 이 시장을 못 풀었는가

- **대형 보험사 내부 CRM**: 개인 사정사가 접근할 수 없거나, 보험사 별로 분절되어 있음.
- **일반 CRM(세일즈포스·채널톡 등)**: "상담 품질 보조" 개념이 없음. 금융 도메인 템플릿 없음.
- **손해사정 전용 SaaS**: 대형 법인·기업용 가격대, 1인 실무자 접근성 낮음.
- **사내 개발된 엑셀·사설 문서**: 확장·공유·감사 불가.

**우리의 위치**: 금융 도메인 + 1인 실무자 가격대 + 품질 보조 기능을 결합한 빈자리에 정확히 맞춰져 있습니다.

---

## 3. 솔루션 — "혼자서도 잘하게 만드는" 플랫폼

우리 제품은 **사건 중심** 이 아닌 **"상담 품질 중심"** 으로 워크플로우를 재설계한 웹 플랫폼입니다.

### 3-1. 확장된 워크플로우

```
  [예약 접수]  →  [사건 생성]  →  [상담 입력]  →  [AI 요약/키워드]
       │             │               │                   │
   자동전환       예약-사건         실시간 도움         보고서 초안
                  히스토리        (추천Q·체크리스트)
                                      │
                                [요약 이메일 발송]
                                      │
                              [MailLog / 감사 이력]
                                      │
                               [Q&A 지식베이스 참조]
```

기존 경쟁사는 "사건 등록 → 보고서 생성" 이라는 좁은 선 위에만 존재합니다. 우리는 그 앞(예약)과 뒤(고객 커뮤니케이션 + 이력)까지 하나의 세션으로 묶었습니다.

### 3-2. 핵심 기능 4축

| 기능 | 실제 동작 | 경쟁 우위 |
|---|---|---|
| **실시간 상담 도움 패널** | 상담 textarea 에 타이핑 → 1.5s debounce → `POST /api/help/suggest` → 사고유형별 rule + 키워드 매칭 결과 실시간 렌더 | 상담 품질의 **평준화** — 경험이 적은 인력도 핵심 질문을 놓치지 않음 |
| **Q&A 지식베이스** | 카테고리(교통/상해/화재/지급/서류/기타) + 키워드 검색 | 공급 불가능한 **금융 도메인 지식 자산**. 고객 포털 공개로 확장 가능 |
| **상담 요약 이메일** | 상담 상세 → 모달에서 미리보기 편집 → Mock 발송 → MailLog 에 감사 기록 | **고객과의 마지막 터치포인트** 자동화. 재발송 이력 감사 가능 |
| **예약 관리** | 예약 등록 → REQUESTED → CONFIRMED → 사건 자동 생성(prefill) → COMPLETED | 사전-사후 **전 구간 커버**. 예약부터 종결까지 단일 이력선 |

### 3-3. 데이터 가치

매 상담마다 다음이 구조화 데이터로 축적됩니다.

- 사고유형별 상담 길이/키워드 분포
- 체크리스트 완수율
- 이메일 발송 시점과 응답율
- 예약 → 사건 전환율

이 데이터는 **phase 2 에서 LLM 엔진(`LlmHelpEngine`) 로 전환될 때 즉시 파인튜닝/RAG 데이터로 재활용** 되도록 설계되어 있습니다.

---

## 4. 차별화 포인트 — 왜 경쟁사가 따라오기 어려운가

### 4-1. "금융 도메인 룰 + 확장 가능한 엔진 추상화"

`HelpRuleEngine` 인터페이스 뒤에 Phase 1 (정적 JSON 룰)과 Phase 2 (LLM) 구현체가 동시에 존재할 수 있습니다.

```java
public interface HelpRuleEngine {
    HelpResponseDto suggest(HelpRequestDto request);
}
```

- Phase 1: `StaticRuleHelpEngine` — 사고유형 × 키워드 × 체크리스트 룰 JSON (이미 구현)
- Phase 2: `LlmHelpEngine` — GPT-4o mini 등 호출 (인터페이스만 바꾸면 됨)

**중요 포인트**: 정적 룰로 출발하기 때문에
- 초기 비용이 거의 0
- 결과가 재현 가능 (감사/규제 대응에 유리)
- 데이터가 축적되면 점진적으로 LLM 으로 전환

경쟁사가 "LLM-first" 로 만들면 토큰 비용·환각·감사 대응이 모두 초기 리스크로 돌아오지만, 우리는 **룰에서 출발해 LLM 으로 진화** 하므로 초기 운영비와 리스크가 모두 낮습니다.

### 4-2. "Mock-first 아키텍처"

`MailSender` 인터페이스 역시 Phase 1 은 MockMailSender (DB 로그만), Phase 2 는 SmtpMailSender 로 `application.yml` 한 줄로 전환됩니다.

```yaml
feature:
  mail:
    sender: mock   # → smtp 로 바꾸면 실제 발송
  help:
    engine: static # → llm 으로 바꾸면 LLM 연동
```

**비즈니스 관점**: 도입 고객은 "메일 발송 설정 없이도 서비스 가치를 즉시 체감" 할 수 있고, 유료 전환 시점에만 SMTP · LLM 자원을 켭니다. CAC 대비 무료 체험 비용이 거의 0.

### 4-3. 도메인 특화 이력 (Audit Trail)

모든 주요 이벤트는 `case_histories` 테이블에 남습니다.
- `CASE_CREATED`, `CONSULTATION_ADDED`, `SUMMARY_GENERATED`, `KEYWORDS_EXTRACTED`, `REPORT_FINALIZED`, `STATUS_CHANGED`
- **신규**: `RESERVATION_LINKED`, `MAIL_SENT`

금융감독 환경에서 **"누가 언제 무엇을 고객에게 전달했는가"** 가 분쟁 시 결정적 증거입니다. 우리는 이 이력을 **부가 기능이 아닌 기본 구조** 로 내장했습니다.

---

## 5. 구현 현황 — 말이 아닌 코드로 증명

**모든 기능은 이미 코드로 실행됩니다.** 투자자 데모 시 아래 경로를 직접 시연할 수 있습니다.

### 5-1. Phase 1 완성된 기능 (데모 가능)

| # | 기능 | 주요 파일 | 엔드포인트 |
|---|---|---|---|
| 1 | 기능 스위치 인프라 | `config/FeatureProperties.java`, `application.yml` | - |
| 2 | Q&A 엔티티/레포/시드 | `qna/entity/QnaItem.java`, `qna/repository/QnaRepository.java`, `data.sql` (13건) | - |
| 3 | Q&A 목록/검색/상세 | `qna/QnaController.java`, `templates/qna/list.html`, `detail.html` | `GET /qna`, `/qna/{id}` |
| 4 | Reservation 엔티티/레포 | `reservation/entity/Reservation.java`, `enums/ReservationStatus.java` | - |
| 5 | Reservation CRUD + 상태전이 | `reservation/ReservationService.java`, `ReservationController.java`, 템플릿 3종 | `GET/POST /reservations`, `POST /reservations/{id}/status` |
| 6 | 예약 → 사건 연결 | `CaseController.java` 수정, `CaseCreateRequest.reservationId` | `GET /cases/new?reservationId=X` |
| 7 | 대시보드 오늘의 예약 위젯 | `DashboardController.java`, `dashboard/index.html` | `GET /dashboard` |
| 8 | Help rules seed + loader | `resources/help/rules.json` (4 사고유형), `help/loader/HelpRuleLoader.java`, `help/model/HelpRule.java` | - |
| 9 | Help 서비스/엔진/API | `help/HelpService.java`, `engine/StaticRuleHelpEngine.java`, `HelpController.java` | `POST /api/help/suggest` |
| 10 | Help Panel UI | `templates/consultations/{new,edit}.html` 2-column 재구성, `static/js/help-panel.js` | (상담 페이지 내장) |
| 11 | MailLog + MockMailSender | `mail/entity/MailLog.java`, `sender/MockMailSender.java` | - |
| 12 | Mail 미리보기 + 발송 | `mail/MailService.java`, `MailController.java`, `templates/mail/templates/summary.html`, `static/js/mail-preview.js` | `GET /api/consultations/{id}/mail/preview`, `POST /api/consultations/{id}/mail/send` |
| 13 | Mail 이력 페이지 | `templates/mail/log_list.html`, `log_detail.html` | `GET /mail/log`, `/mail/log/{id}` |
| 14 | History 확장 + 데모 seed | `HistoryActionType` (2개 이벤트 추가), `data.sql` (예약 3건 + QnA 13건 + 고객 이메일 채움) | - |

### 5-2. 신규 추가된 DB 오브젝트

| 테이블 | 용도 | 설계 의도 |
|---|---|---|
| `qna_items` | Q&A 지식 자산 | 카테고리·태그 검색, 공개/비공개 플래그 → 고객 포털 확장 대비 |
| `reservations` | 예약 관리 + 사건 연결 | `case_id` FK 로 사건과 1:1 연결, 상태 5종 |
| `mail_logs` | 발송 감사 로그 | status(MOCK/SENT/FAILED) + body HTML 원본 보관 |
| `clients.email` | 기존 컬럼 활용 | Mock mail 발송 대상 확보 |

### 5-3. 코드 지표

- 총 Java 파일 **80개** (기존 53 + 신규 27)
- 신규 Thymeleaf 템플릿 **9종**
- 신규 JS 모듈 **2종** (help-panel.js, mail-preview.js)
- rule JSON: 4 사고유형 × 평균 5개 항목 × 4 섹션 = **즉시 사용 가능한 80+ 도움 항목**

---

## 6. 기술 아키텍처 — 확장성 vs 운영비용의 균형

### 6-1. 기술 스택

- **백엔드**: Java 17, Spring Boot 3.2, Spring Data JPA, Spring Security, Validation
- **프런트엔드**: Thymeleaf server-rendered + 필요한 위치만 Ajax (SPA 전환 비용 회피)
- **DB**: MySQL 8 (prod) / H2 in-memory (dev·데모)
- **통합**: WebClient + WebSocket (기존 자산 유지)

### 6-2. 설계 원칙

1. **단일 모듈 · 논리적 패키지 분리** — 멀티 모듈로 쪼개지 않고 `com.adjuster.system.{help|qna|mail|reservation}` 으로 경계 설정. 배포·운영 단순성 최우선.
2. **인터페이스 뒤에 구현 분기** — `@ConditionalOnProperty` 를 사용해 Phase 1 ↔ 2 를 yaml 한 줄로 전환.
3. **서버 렌더링 우선** — React SPA 로 재구성하지 않고, Ajax 는 "실시간성이 가치인 구간" (도움 패널, 메일 모달) 에만 한정.
4. **Mock-first** — 외부 의존(SMTP·LLM)이 없어도 end-to-end 흐름 시연 가능.

### 6-3. 확장 플랜 (코드 구조로 이미 준비됨)

| 확장 시나리오 | 필요 작업 | 기존 코드 수정 |
|---|---|---|
| 실제 SMTP 발송 | `SmtpMailSender implements MailSender` 추가 | 0 line (yaml 만 변경) |
| LLM 기반 도움 | `LlmHelpEngine implements HelpRuleEngine` 추가 | 0 line (yaml 만 변경) |
| 관리자 Q&A CRUD | 컨트롤러 1개 + 템플릿 2개 추가 | 0 line |
| 고객 포털(공개 FAQ) | Security 설정 + `isPublic` 필터 | 수 line |
| 캘린더/SMS 알림 | `NotificationSender` 인터페이스 신설 | 0 line |

**투자 관점**: 피벗·기능 확장의 한계 비용이 낮습니다. 검증된 세그먼트에 따라 LLM 비중·고객 포털·SMS 등을 On/Off 방식으로 선별 투입 가능합니다.

---

## 7. 비즈니스 모델

### 7-1. 세그먼트와 가격 제안

| 세그먼트 | 인원 규모 | 결제 의사 | 제안 구성 |
|---|---|---|---|
| **1인 손해사정사** | 1 | 월 2만~3만원대 저가 SaaS 선호 | Core (상담·예약·Q&A), Mock 메일 무료 |
| **소규모 법인 (2~10인)** | 2~10 | 월 10만~20만원대 팀 단위 | + 실 SMTP 발송 + 관리자 Q&A CRUD + 히스토리 export |
| **보험 대리점 / 제휴 법인** | 10~50 | 연 단위 계약 | + LLM 엔진 + 고객 포털 + SSO + 감사 리포트 |

### 7-2. 수익 구조

1. **구독형 SaaS** (주수입) — 인당/팀당 월정액
2. **Q&A 콘텐츠 라이선스** — 대형 보험사의 상담센터에 "도메인 룰 팩" 납품
3. **도메인 특화 LLM 파인튜닝 서비스** — 축적된 상담 데이터(익명화) 기반 맞춤 모델 제공

### 7-3. Go-To-Market

- **Phase 1 (0-6개월)**: 개인 사정사 커뮤니티/카페 대상 **freemium 배포**. Mock 메일 + 정적 룰로 "비용 없이 체험" 가능한 구조를 활용.
- **Phase 2 (6-18개월)**: 초기 유료 고객 50~100명 확보 후, 소규모 법인 대상 팀 플랜 확대.
- **Phase 3 (18개월+)**: 대리점·협회 B2B2C 채널 및 대형 보험사 제휴.

---

## 8. 로드맵

### Phase 1 — Demo MVP (✅ 완료)
- 4개 핵심 기능 + 기존 사건/상담/보고서 파이프라인 통합
- Mock 기반 end-to-end 데모 가능

### Phase 2 — 유료 베타 (다음 3~6개월)
- SMTP 실제 발송 + 첨부 PDF
- 관리자 Q&A CRUD
- 상담 snapshot 영속화 (체크리스트 상태 DB 저장)
- 고객 포털 공개 FAQ (읽기 전용)
- 모바일 반응형 UI 최적화

### Phase 3 — 도메인 특화 AI (6~12개월)
- `LlmHelpEngine` 투입, RAG 기반 사고유형 세분화
- 상담 자동 요약 + 문서 자동 생성 (진단서·합의서 초안)
- 예약 self-service + 캘린더 연동 (Google/iCal)

### Phase 4 — B2B2C 확장 (12개월+)
- 다중 사무소 / 조직 권한
- 감사 리포트, 지급 지연 자동 알림
- 대리점·협회 화이트라벨

---

## 9. 기대 효과 & KPI

### 9-1. 고객 관점 가치 제안

- 상담 시간 **30% 단축** (추천 질문 · 체크리스트가 기억 부담을 대체)
- 서류 누락으로 인한 재안내 **50% 감소** (필요 서류 자동 제시)
- 파트타임 인력 상담 품질을 **시니어 대비 80% 수준** 으로 평준화
- 고객 커뮤니케이션 시점이 기록되어 **분쟁 시 증빙 시간 단축**

### 9-2. 측정 KPI (Phase 2 에서 수집)

- MAU / WAU (로그인 기준)
- 일일 상담 저장 수 (제품 사용 깊이)
- 예약 → 사건 전환율 (사전 후크 가치)
- 메일 발송 수 / 상담 대비 비율 (사후 후크 가치)
- 도움 패널 인터랙션율 (체크박스 체크 비율)
- 유료 전환율 / 이탈율

---

## 10. 리스크와 완화

| 리스크 | 완화 전략 |
|---|---|
| 도메인 룰 유지 보수 부담 | Phase 1 은 고빈도 사고유형 4종으로 한정. Phase 2 에서 LLM 로 대체 가능한 구조. |
| 개인정보 보호 / 규제 | 감사 로그(`case_histories`, `mail_logs`) 를 기본 구조에 내장. 고객 이메일·전화는 필수 필드 1개만 요구. |
| LLM 비용 폭증 | Static → LLM 단계적 전환. 요금제별 LLM 사용량 상한 관리. |
| 신규 고객 획득 비용 | Mock-first 구조 → 무료 체험 비용이 사실상 0. |
| 대형 경쟁사 진입 | "1인 사정사" 라는 비효율 시장은 대형사가 접근하기 어려움 + 룰/지식 자산의 축적 효과. |

---

## 11. 투자 요청 (Ask)

### 11-1. 자금 용도 (Seed 라운드 기준)

| 항목 | 비중 | 구체 내역 |
|---|---|---|
| 엔지니어링 | 45% | Phase 2 (SMTP·관리자 CRUD·모바일 UI) 완성 |
| 도메인 전문가 협업 | 20% | 현직 손해사정사 자문 계약, 룰 팩 확장 |
| LLM 엔진 연구 개발 | 15% | `LlmHelpEngine` PoC, RAG 데이터 파이프라인 |
| GTM · 마케팅 | 15% | 커뮤니티 입점, 컨텐츠 마케팅 |
| 운영 | 5% | 클라우드, 도메인, SaaS 툴 |

### 11-2. 마일스톤

- **M+3**: 유료 베타 20 개인 사정사 계약, 실 SMTP 발송 오픈
- **M+6**: 월 매출 500만원, Q&A 관리자 CRUD · 모바일 UI 완성
- **M+12**: LLM 엔진 A/B 검증, 소규모 법인 팀 플랜 오픈, 월 매출 2천만원
- **M+18**: 대리점 채널 1곳 제휴, 시리즈 A 논의 개시

---

## 12. 실행력 증명

**우리 팀은 이 보고서의 모든 내용을 말이 아니라 코드로 증명했습니다.**

- 기획·설계·구현·문서를 **단일 스프린트에 끝냈음** (14 티켓 전수 완료)
- 기술 선택은 **"데모 완성도 + 운영 최저 비용"** 원칙으로 일관됨
- 확장성은 **아키텍처에 이미 내장** (인터페이스 + `@ConditionalOnProperty`)
- 모든 주장이 `README.md` + 실제 파일 경로로 검증 가능

---

## 부록 A. 데모 시연 스크립트 (약 7분)

| 시간 | 시연 내용 | 증명하는 가치 |
|---|---|---|
| 0:00 | `./gradlew bootRun` → `http://localhost:8080` 로그인 | 기동 시간 · 운영 단순성 |
| 0:30 | 대시보드의 "오늘의 예약" 위젯 | 사전 단계 흐름 커버 |
| 1:00 | 예약 등록 → 확정 → 사건 자동 전환 | 예약-사건 자동 링크 |
| 2:30 | 상담 입력 중 우측 도움 패널 실시간 갱신 + 키워드 힌트 | **제품의 시그니처 순간** |
| 4:00 | 상담 저장 → 기존 AI 요약/키워드 추출 | 기존 기능 유지 |
| 5:00 | 상담 상세 → 요약 이메일 발송 모달 → Mock 발송 → 토스트 | 고객 커뮤니케이션 자동화 |
| 5:40 | 메일 이력 화면 → 로그 상세 HTML iframe | 감사 증빙성 |
| 6:30 | Q&A 지식베이스 검색 → 상세 열람 | 지식 자산 축적 |
| 7:00 | `feature.mail.sender: mock → smtp` 코드 한 줄 전환 시연 | 확장성 증명 |

---

## 부록 B. Phase 1 ↔ Phase 2 전환 체크리스트

| 영역 | Phase 1 (현재) | Phase 2 전환 시 필요 작업 |
|---|---|---|
| 이메일 | MockMailSender + MailLog (MOCK) | SmtpMailSender 구현체 추가, `spring-boot-starter-mail`, SMTP 인증 정보 설정 |
| 도움 엔진 | StaticRuleHelpEngine + JSON | LlmHelpEngine 구현체 추가, OpenAI/Anthropic API 키, 프롬프트/RAG 데이터 구성 |
| 체크리스트 | localStorage | DB `help_snapshot` 테이블 추가 + 서비스 저장 로직 |
| 예약 슬롯 | 자유 입력 | 영업시간/휴무일 템플릿 테이블 |
| 알림 | 없음 | NotificationSender 인터페이스 신설 |
| 감사 | `case_histories` + `mail_logs` | 관리자 리포트 export (CSV/PDF) |

---

**Contact**: 프로젝트 팀 (이예진·지윤석)
**Repo**: `adjuster-system` (Spring Boot 3.2 · Java 17 · MySQL 8 / H2)
**Demo 계정**: `adjuster@test.com` / `adjuster123`

# AI 기반 개인 손해사정사 업무 자동화 & 상담 운영 지원 시스템

Spring Boot 3.2 + Thymeleaf + JPA 기반의 손해사정 업무/상담 운영 지원 플랫폼.
기존 `사건 → 고객 → 상담 → AI 요약 → 보고서 → 이력` 파이프라인을 그대로 유지한 상태에서,
다음 4개 축이 추가되었습니다.

1. **실시간 상담 도움 패널** — 상담 입력 중 사고유형/키워드 기반 추천 질문·체크리스트·필요 서류·주의사항
2. **Q&A / FAQ 참조 지식베이스** — DB seed 기반 검색/열람
3. **상담 요약 이메일 발송 (mock)** — 상담 상세에서 미리보기 + 발송, MailLog 이력
4. **상담 예약/약속 스케줄링** — 예약 CRUD, 상태 전이, 사건 생성으로 전환

---

## 실행 방법 (로컬/데모)

```bash
# 1. 프로젝트 루트에서
./gradlew bootRun

# 2. 브라우저
http://localhost:8080

# 3. H2 콘솔 (local 프로파일)
http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:adjusterdb
User: sa, Password: (빈 값)
```

**데모 계정**
- email: `adjuster@test.com`
- password: `adjuster123`

프로파일은 기본값이 `local` (H2 in-memory) 입니다. MySQL 로 전환하려면
`application.yml` 의 `spring.profiles.active` 를 제거/변경하세요.

---

## 기능 스위치 (phase 1 ↔ phase 2)

`application.yml` 의 `feature.*` 프로퍼티로 구현체를 분기합니다.

```yaml
feature:
  mail:
    sender: mock      # mock (phase 1, 기본) | smtp (phase 2)
  help:
    engine: static    # static (phase 1, 기본) | llm (phase 2)
```

- `MockMailSender` / `StaticRuleHelpEngine` 는 `@ConditionalOnProperty` 로 기본 활성화.
- phase 2 전환 시 `SmtpMailSender` / `LlmHelpEngine` 구현체만 추가하면 컨트롤러·서비스 수정 없이 교체 가능.

---

## 데모 시나리오 (추천 순서)

로그인 후 아래 순서대로 진행하면 4개 신규 기능이 모두 노출됩니다.

1. **로그인** → 대시보드  
   → 상단 네비: 대시보드 / 사건 목록 / 예약 / Q&A / 메일 이력 / 새 사건  
   → 대시보드에 **"오늘의 예약"** 위젯 노출 (seed 에 의해 2~3건 표시됨)

2. **예약 등록 플로우**  
   `/reservations` → `+ 새 예약` → 고객명 / 예약일시 / 사고유형 / 연락처 or 이메일 입력 → 저장  
   → 상세에서 **"확정"** 버튼 → 상태 `REQUESTED → CONFIRMED`

3. **예약 → 사건 전환**  
   예약 상세의 **"사건 생성으로 이동"** 클릭  
   → 사건 등록 화면에 고객명/사고유형/메모가 prefill 됨 (파란 배너로 표시)  
   → 저장 시 해당 예약의 `case_id` 가 채워지고 `COMPLETED` 로 전환  
   → 사건 타임라인(`/cases/{id}/history`) 에 **"RESERVATION_LINKED"** 이벤트 표시

4. **실시간 도움 패널**  
   생성된 사건 → 상담 기록 입력  
   → 상담 내용을 타이핑하면 **약 1.5초 debounce 후 우측 패널에 추천 질문 / 체크리스트 / 필요 서류 / 주의사항 갱신**  
   → 키워드(예: "후방추돌", "합의", "기왕증")를 포함하면 하단 **"키워드 힌트"** 섹션이 추가로 노출

5. **상담 저장 → 기존 AI 요약/키워드 추출 (기존 기능)**  
   저장 후 상담 상세 → AI 요약 생성 → 키워드 추출

6. **상담 요약 이메일 발송 (mock)**  
   상담 상세 하단의 **"✉️ 상담 요약 이메일 발송"** → 모달 팝업  
   → 수신자/제목/본문 미리보기 확인 → **"발송 (mock)"** 클릭  
   → 성공 토스트, `mail_logs` 에 MOCK 상태로 기록, 사건 타임라인에 **"MAIL_SENT"** 이벤트

7. **메일 이력 확인**  
   네비 **"메일 이력"** (`/mail/log`) → 방금 발송 로그 목록 → 상세에서 원문 HTML iframe 으로 열람

8. **Q&A 지식베이스**  
   네비 **"Q&A"** (`/qna`) → 카테고리(TRAFFIC/INJURY/FIRE/PAYMENT/DOC/ETC) / 키워드 검색  
   → 상세 열람. seed 로 13건 제공.

---

## 주요 신규 엔드포인트

| Method | Path | 설명 |
|---|---|---|
| GET | `/qna` | Q&A 목록/검색 |
| GET | `/qna/{id}` | Q&A 상세 |
| GET | `/reservations` | 예약 목록 (상태/기간 필터) |
| GET/POST | `/reservations/new`, `/reservations` | 예약 등록 |
| GET | `/reservations/{id}` | 예약 상세 |
| POST | `/reservations/{id}/status` | 상태 전이 (CONFIRMED/CANCELLED/NO_SHOW) |
| GET | `/cases/new?reservationId={id}` | 예약 prefill 사건 등록 |
| GET | `/mail/log`, `/mail/log/{id}` | 메일 발송 이력 |
| POST (JSON) | `/api/help/suggest` | 실시간 도움 패널 데이터 |
| GET (JSON) | `/api/consultations/{id}/mail/preview` | 이메일 미리보기 데이터 |
| POST (JSON) | `/api/consultations/{id}/mail/send` | 이메일 발송 (mock) |

---

## 패키지 구조 (신규)

```
com.adjuster.system
├── config/FeatureProperties.java
├── help/
│   ├── HelpController / HelpService
│   ├── engine/HelpRuleEngine (I/F) + StaticRuleHelpEngine
│   ├── loader/HelpRuleLoader   ← resources/help/rules.json
│   ├── model/HelpRule
│   └── dto/HelpRequestDto, HelpResponseDto
├── qna/
│   ├── QnaController / QnaService
│   ├── entity/QnaItem
│   └── repository/QnaRepository
├── mail/
│   ├── MailController / MailService
│   ├── entity/MailLog
│   ├── repository/MailLogRepository
│   ├── sender/MailSender (I/F) + MockMailSender
│   ├── template/MailTemplateRenderer
│   └── dto/MailPreviewDto, MailSendDto
└── reservation/
    ├── ReservationController / ReservationService
    ├── entity/Reservation
    ├── enums/ReservationStatus
    ├── repository/ReservationRepository
    └── dto/ReservationForm
```

리소스:
- `resources/help/rules.json` — 사고유형별 help rule seed (TRAFFIC/INJURY/FIRE/OTHER)
- `resources/templates/{qna,reservation,mail}/*.html` — 신규 Thymeleaf 템플릿
- `resources/templates/mail/templates/summary.html` — 이메일 본문 템플릿
- `resources/static/js/help-panel.js`, `mail-preview.js` — 프런트 보조 스크립트

---

## DB 확장 요약

| 테이블 | 신규/수정 | 비고 |
|---|---|---|
| `qna_items` | 신규 | FAQ/참조 데이터 |
| `reservations` | 신규 | 상담 예약. `case_id` 로 사건과 연결 |
| `mail_logs` | 신규 | 발송 이력 (MOCK/SENT/FAILED) |
| `clients.email` | 기존 컬럼 seed 채움 | 이메일 발송 대상 |
| `HistoryActionType` enum | 확장 | `RESERVATION_LINKED`, `MAIL_SENT` 추가 |

---

## Phase 1 → Phase 2 전환 포인트

| 영역 | Phase 1 (현재) | Phase 2 (향후) |
|---|---|---|
| 이메일 발송 | `MockMailSender` — MailLog 에 MOCK 저장 | `SmtpMailSender` + `spring-boot-starter-mail`, 첨부 PDF, 재시도 |
| 도움 엔진 | `StaticRuleHelpEngine` — rules.json | `LlmHelpEngine` — 외부 LLM 호출 (ai.mode=openai 연동) |
| 체크리스트 상태 | localStorage | DB `help_snapshot` 영속화 |
| 예약 시간 슬롯 | 자유 입력 | 영업시간/휴무일 템플릿, 고객 self-service 토큰 |
| Q&A 관리 | DB seed 수정 | 관리자 CRUD, 공개 플래그로 고객 포털 노출 |
| 알림 | 없음 | 이메일/SMS/알림톡 |
| 캘린더 연동 | 없음 | Google Calendar / iCal |

---

## 테스트 계정

| email | password | role |
|---|---|---|
| adjuster@test.com | adjuster123 | ADJUSTER |

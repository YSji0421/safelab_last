-- 테스트 계정 (비밀번호: adjuster123)
INSERT INTO users (email, password, name, phone, role, login_fail_count, locked)
VALUES ('adjuster@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '김사정', '010-1234-5678', 'ADJUSTER', 0, false);

-- 사건 3건
INSERT INTO cases (user_id, case_number, case_name, accident_type, status, received_date)
VALUES
  (1, 'CASE-20250110-001', '박지훈 교통사고건', 'TRAFFIC', 'IN_PROGRESS', '2025-01-10'),
  (1, 'CASE-20250112-002', '이수연 상해보험 청구건', 'INJURY', 'RECEIVED', '2025-01-12'),
  (1, 'CASE-20250115-003', '최민준 화재 피해건', 'FIRE', 'COMPLETED', '2025-01-15');

-- 고객 3명 (이메일 컬럼 채움: mail 발송 데모용)
INSERT INTO clients (case_id, client_name, phone, email, insurer_name, policy_number, accident_date, injury_content)
VALUES
  (1, '박지훈', '010-9876-5432', 'parkjh@example.com',  'DB손해보험', 'DB-2024-00123', '2025-01-08', '경추 염좌, 요추 염좌'),
  (2, '이수연', '010-5555-7777', 'leesy@example.com',   '삼성화재',   'SH-2023-98765', '2025-01-11', '우측 발목 골절'),
  (3, '최민준', '010-3333-4444', 'choimj@example.com',  '현대해상',   'HH-2022-55432', '2025-01-14', '주방 화재로 인한 재산 피해');

-- 상담 기록
INSERT INTO consultations (case_id, consult_seq, consult_datetime, consult_method, content, summary_content, keywords, summary_generated)
VALUES
  (1, 1, '2025-01-10 14:00:00', 'PHONE',
   '고객 박지훈씨가 전화로 1월 8일 교통사고 상황을 설명함. 신호 대기 중 후방 추돌 사고 발생. 현재 정형외과 치료 중이며 경추 및 요추 통증 호소. 보험사에서 합의 요청 연락이 왔다고 함. 치료 기간 및 합의금 관련 검토 의뢰.',
   '신호 대기 중 후방 추돌 사고 발생. 경추·요추 염좌 진단으로 치료 중. 보험사 조기 합의 요청에 대한 검토 의뢰.',
   '후유장해,치료비,합의금,과실비율,대인배상', true),
  (3, 1, '2025-01-15 10:00:00', 'IN_PERSON',
   '주방에서 가스 누출로 인한 화재 발생. 건물 일부 및 가재도구 손해. 화재보험 청구 관련 상담. 보험사 현장 조사 예정.',
   '가스 누출 화재로 건물 및 가재도구 손해 발생. 화재보험 청구 및 현장 조사 진행 예정.',
   '재물손해,화재보험,가재도구,건물손해,화재원인조사', true);

-- 보고서 (완료 사건)
INSERT INTO reports (case_id, title, report_content, adjuster_opinion, conclusion, status)
VALUES (3, '최민준 화재 피해건 손해사정 보고서',
  '[손해사정 보고서]\n작성일: 2025-01-20\n사건번호: CASE-20250115-003\n\n1. 사건 개요\n사건명: 최민준 화재 피해건\n사고유형: 화재\n\n2. 피보험자 정보\n성명: 최민준\n연락처: 010-3333-4444\n\n3. 상담 요약\n가스 누출 화재로 건물 및 가재도구 손해 발생.\n\n4. 보장 검토 핵심 항목\n재물손해, 화재보험, 가재도구, 건물손해',
  '화재 원인 및 손해액을 검토한 결과 보험 약관 상 보장 범위 내에 해당함.',
  '보험금 청구 금액은 적정 수준으로 판단되며 지급 권고함.',
  'FINAL');

-- Q&A 시드 (FAQ)
INSERT INTO qna_items (category, title, content, tags, is_public) VALUES
 ('TRAFFIC', '후방 추돌 사고 시 과실비율은 어떻게 산정되나요?',
  '정차 중 후방 추돌은 가해 차량 100% 과실이 원칙입니다. 다만 급정거·비상등 미점등 등 특이 사유가 있으면 조정될 수 있으며, 블랙박스·사고조사서·신호/도로 상황 자료가 필요합니다.',
  '과실비율,후방추돌,교통사고', true),
 ('TRAFFIC', '경추 염좌로 치료 중인데 합의는 언제 하는 것이 좋을까요?',
  '급성기 치료가 종료되고 증상이 안정된 이후, 일반적으로 최소 4~6주 이상 경과 후 합의 진행을 권장합니다. 후유장해 가능성이 있으면 MRI 등 영상의학 검사 결과 확인 후 합의하는 것이 안전합니다.',
  '합의금,경추염좌,치료기간,후유장해', true),
 ('TRAFFIC', '교통사고 접수 시 필요한 서류는?',
  '교통사고사실확인원, 진단서, 치료비 영수증, 보험증권, 신분증 사본, 차량등록증(해당 시), 현장 사진/블랙박스 영상 등이 기본입니다.',
  '필요서류,교통사고,접수', true),
 ('INJURY', '상해보험금 청구 시 기본 제출 서류는?',
  '청구서, 진단서(상병코드 포함), 입·퇴원 확인서, 치료비 세부내역서, 수술확인서(해당 시), 본인 신분증 사본, 보험금 수령 계좌 사본이 필요합니다.',
  '상해보험,청구서류,진단서', true),
 ('INJURY', '후유장해 청구 시 주의점은?',
  '치료 종결 후 6개월 이상 경과가 일반 기준이며, 장해진단서에는 AMA/맥브라이드 등 방식 및 해당 약관 기준이 명시되어야 합니다. 제삼자 의뢰 평가를 고려하는 것이 좋습니다.',
  '후유장해,장해진단,AMA,맥브라이드', true),
 ('FIRE', '화재사고 발생 시 초기 조치는?',
  '119 신고 후 현장 보존, 소방서 화재조사보고서 발급 요청, 피해 품목 사진/영상 촬영, 제삼자 배상 여부 확인을 우선 진행합니다.',
  '화재,초기조치,현장보존,소방조사', true),
 ('FIRE', '가재도구 손해 입증은 어떻게 하나요?',
  '구매 영수증·카드내역·택배 송장 등 취득 증빙과 현장 사진, 품목 리스트(수량·취득가·추정 잔존가)를 함께 제출해야 보상 산정이 원활합니다.',
  '가재도구,손해입증,증빙자료', true),
 ('PAYMENT', '보험금 지급이 지연될 때 어떻게 대응하나요?',
  '표준약관상 서류 접수 후 영업일 10일 이내 지급이 원칙입니다. 초과 시 지연이자 청구가 가능하며, 금감원 민원 절차 안내도 병행합니다.',
  '지급지연,지연이자,민원', true),
 ('PAYMENT', '면책 통보를 받았을 때 검토 포인트는?',
  '면책 사유가 약관 어느 조항에 근거하는지 먼저 확인하고, 사실관계(고의/과실/계약 전 알릴의무 위반 여부)를 재검토합니다. 필요 시 금감원 분쟁조정 신청을 고려합니다.',
  '면책,약관,분쟁조정', true),
 ('DOC', '진단서와 소견서의 차이는?',
  '진단서는 상병명과 치료기간이 명시된 공식 문서로 의무기록 기반이고, 소견서는 의사의 의학적 의견을 담은 참고 자료입니다. 청구에는 진단서가 필수입니다.',
  '진단서,소견서,의무기록', true),
 ('DOC', '원본 서류와 사본, 어떤 것을 제출해야 하나요?',
  '대부분의 보험사는 사본 제출도 가능하나 진단서·장해진단서 등 의료 핵심 문서는 원본을 요구하는 경우가 많습니다. 사전 확인이 필요합니다.',
  '원본,사본,서류제출', true),
 ('ETC', '비대면(전화/영상) 상담 시 녹음/녹화 동의는 어떻게 받나요?',
  '상담 시작 전 구두/체크박스로 명시적 동의를 받고, 근거를 상담 기록에 남겨야 합니다. 민감정보 취급 시 개인정보 처리방침 고지도 필요합니다.',
  '비대면상담,녹음동의,개인정보', false),
 ('ETC', '고객이 보험금 포기 각서를 요구받았다고 합니다. 주의점은?',
  '포기 각서는 이후 분쟁 여지를 크게 줄이는 서면이므로, 향후 치료 가능성이나 후유장해 예상 시 신중해야 합니다. 서명 전 상담사 검토 권장입니다.',
  '포기각서,합의,분쟁예방', false);

-- 예약 시드 (오늘 + 미래) - H2/MySQL 모두에서 동작하는 표현식 사용
INSERT INTO reservations (client_name, client_phone, client_email, start_at, duration_min, accident_type, memo, status)
VALUES
 ('정수진', '010-2222-1111', 'sujin@example.com', DATEADD('HOUR', 2, CURRENT_TIMESTAMP), 30, 'TRAFFIC', '신호대기 중 접촉사고, 차량 수리견적 문의', 'CONFIRMED'),
 ('오세훈', '010-3333-2222', NULL,               DATEADD('HOUR', 5, CURRENT_TIMESTAMP), 45, 'INJURY', '계단 낙상 상해보험 청구 관련', 'REQUESTED'),
 ('김도윤', '010-4444-5555', 'doyun@example.com', DATEADD('DAY', 1, CURRENT_TIMESTAMP), 30, 'FIRE', '매장 화재 피해 상담 희망', 'REQUESTED');

-- 이력
INSERT INTO case_histories (case_id, action_type, description)
VALUES
  (1, 'CASE_CREATED', '사건 등록: 박지훈 교통사고건'),
  (1, 'CLIENT_UPDATED', '고객 정보 입력: 박지훈'),
  (1, 'CONSULTATION_ADDED', '1회 전화 상담 기록 저장'),
  (1, 'SUMMARY_GENERATED', '1회 상담 AI 요약 완료'),
  (1, 'KEYWORDS_EXTRACTED', '키워드 추출: 후유장해, 치료비, 합의금'),
  (1, 'STATUS_CHANGED', '접수 → 진행중'),
  (3, 'CASE_CREATED', '사건 등록: 최민준 화재 피해건'),
  (3, 'CLIENT_UPDATED', '고객 정보 입력: 최민준'),
  (3, 'CONSULTATION_ADDED', '1회 대면 상담 기록 저장'),
  (3, 'SUMMARY_GENERATED', '1회 상담 AI 요약 완료'),
  (3, 'REPORT_CREATED', '보고서 초안 생성'),
  (3, 'REPORT_FINALIZED', '보고서 최종 완료 처리'),
  (3, 'STATUS_CHANGED', '진행중 → 완료');

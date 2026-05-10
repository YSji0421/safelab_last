import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEPARTMENT_LIST, getDepartment } from '../data/departments';
import { INSURANCE_PLANS } from '../data/insurancePlans';
import './EnrollmentPage.css';

// 「연구실 안전환경 조성에 관한 법률」 제26조 의무 가입 신청 폼.
// 학교가 단체 가입한 4종 보험에 본인 정보 등록·확인 의사를 접수.

export default function EnrollmentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    studentNo: '',
    name: '',
    deptId: '',
    phone: '',
    email: '',
    consent1: false, // 약관 동의
    consent2: false, // 개인정보 수집 동의
    consent3: false, // 단체보험 가입 의사
  });
  const [submitted, setSubmitted] = useState(null);

  const dept = form.deptId ? getDepartment(form.deptId) : null;

  const valid = useMemo(() => {
    return (
      form.studentNo.trim().length >= 8 &&
      form.name.trim().length >= 2 &&
      form.deptId &&
      form.phone.trim().length >= 9 &&
      form.email.includes('@') &&
      form.consent1 &&
      form.consent2 &&
      form.consent3
    );
  }, [form]);

  const update = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    const record = {
      ...form,
      enrolledAt: new Date().toISOString(),
      receiptNo: 'CGM-' + Date.now().toString().slice(-8),
      coverage: ['대학배상책임공제', '교육시설안전공제', '연구실안전공제', '신입생 OT 담보'],
    };
    try {
      localStorage.setItem(`safelab.enrollment.${form.studentNo}`, JSON.stringify(record));
    } catch {}
    setSubmitted(record);
    setStep(3);
  };

  return (
    <div className="app-shell">
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />

      <div className="en-frame">
        <header className="en-header">
          <button className="en-back" onClick={() => navigate(-1)} aria-label="뒤로">←</button>
          <div className="en-header__title">
            <h1>연구실안전공제 가입 신청</h1>
            <p>「연구실 안전환경 조성에 관한 법률」 제26조 의무 가입 — 인하공전 단체 가입</p>
          </div>
          <div className="en-header__right" />
        </header>

        <main className="en-main">
          {/* 진행 단계 */}
          <div className="en-steps">
            <span className={`en-step ${step >= 1 ? 'is-active' : ''}`}>1. 정보 입력</span>
            <span className={`en-step ${step >= 2 ? 'is-active' : ''}`}>2. 약관 동의</span>
            <span className={`en-step ${step >= 3 ? 'is-active' : ''}`}>3. 접수 완료</span>
          </div>

          {step !== 3 && (
            <div className="en-section__head">
              <span className="eyebrow">CampusGuard Mutual</span>
              <h2>의무 가입 절차 — 학교 단체 가입에 본인 등록</h2>
              <p>
                인하공전이 단체 가입한 4종 보험(공제)에 본인 정보를 등록하고 동의 의사를 접수합니다.
                실제 보험금 지급 자격은 「연구실안전공제」 약관·면책사유에 따라 결정됩니다.
              </p>
            </div>
          )}

          {/* Step 1+2: Form */}
          {step !== 3 && (
            <form className="glass-card en-form" onSubmit={submit}>
              <fieldset className="en-fieldset">
                <legend>👤 본인 정보</legend>
                <div className="en-grid-2">
                  <label className="en-field">
                    <span>학번 *</span>
                    <input type="text" inputMode="numeric" placeholder="20245010"
                      value={form.studentNo} onChange={update('studentNo')} required />
                  </label>
                  <label className="en-field">
                    <span>이름 *</span>
                    <input type="text" placeholder="홍길동"
                      value={form.name} onChange={update('name')} required />
                  </label>
                  <label className="en-field">
                    <span>학과 *</span>
                    <select value={form.deptId} onChange={update('deptId')} required>
                      <option value="">선택하세요</option>
                      {DEPARTMENT_LIST.map((d) => (
                        <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="en-field">
                    <span>휴대폰 *</span>
                    <input type="tel" placeholder="010-0000-0000"
                      value={form.phone} onChange={update('phone')} required />
                  </label>
                  <label className="en-field en-field--full">
                    <span>이메일 *</span>
                    <input type="email" placeholder="202445010@itc.ac.kr"
                      value={form.email} onChange={update('email')} required />
                  </label>
                </div>
              </fieldset>

              <fieldset className="en-fieldset">
                <legend>🛡️ 가입 보장 (학교 단체 가입 자동 적용)</legend>
                <ul className="en-coverage">
                  {Object.values(INSURANCE_PLANS).map((p) => (
                    <li key={p.name} className="en-coverage__item">
                      <strong>{p.name}</strong>
                      <small>법적 근거: {p.legalBasis || p.name}</small>
                    </li>
                  ))}
                </ul>
              </fieldset>

              <fieldset className="en-fieldset">
                <legend>📜 약관 동의 *</legend>
                <label className="en-consent">
                  <input type="checkbox" checked={form.consent1} onChange={update('consent1')} />
                  <span>
                    <strong>「연구실안전공제」 약관 전문 동의</strong>
                    <small>제3조(보상하는 손해), 제10조(면책사유), 제11조(통지의무) 포함 — 미숙지 시 사고 손해 증가분 미보상.</small>
                  </span>
                </label>
                <label className="en-consent">
                  <input type="checkbox" checked={form.consent2} onChange={update('consent2')} />
                  <span>
                    <strong>개인정보 수집·이용 동의</strong>
                    <small>학번·이름·학과·연락처·이메일을 단체 보험 가입 관리 목적으로 한국교육시설안전원에 제공.</small>
                  </span>
                </label>
                <label className="en-consent">
                  <input type="checkbox" checked={form.consent3} onChange={update('consent3')} />
                  <span>
                    <strong>「실습실 안전관리규정」 준수 의사 확인</strong>
                    <small>인하공전 내규에 따라 실습실 안전수칙·안전장구 착용·일상점검 협조 의무 이행.</small>
                  </span>
                </label>
              </fieldset>

              <div className="en-actions">
                <button type="button" className="t-btn t-btn-ghost" onClick={() => navigate('/insurance/consult')}>
                  먼저 상담 받기
                </button>
                <button type="submit" className="t-btn t-btn-primary" disabled={!valid}>
                  {valid ? '의무 가입 접수' : '필수 항목을 모두 입력해주세요'}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: 완료 */}
          {step === 3 && submitted && (
            <article className="glass-card en-done">
              <div className="en-done__check">✓</div>
              <h2>의무 가입 접수 완료</h2>
              <p>
                <strong>{submitted.name}</strong>님 ({dept?.name}, 학번 {submitted.studentNo}) 의 연구실안전공제 가입 의사가 접수되었습니다.
              </p>
              <dl className="en-done__dl">
                <div><dt>접수번호</dt><dd>{submitted.receiptNo}</dd></div>
                <div><dt>접수일시</dt><dd>{new Date(submitted.enrolledAt).toLocaleString('ko-KR')}</dd></div>
                <div><dt>적용 보장</dt><dd>{submitted.coverage.length}종</dd></div>
                <div><dt>유효기간</dt><dd>2026-03-28 ~ 2027-03-27</dd></div>
              </dl>

              <div className="en-done__notice">
                <strong>다음 단계</strong>
                <ul>
                  <li>14일 이내 한국교육시설안전원 (☎ 02-6710-1700) 에서 본인 확인 연락 예정</li>
                  <li>본인 정보 변경 시 학사지원팀 (☎ 032-870-2030) 에 즉시 통지</li>
                  <li>사고 발생 시 즉시 통보 의무 (약관 제11조) — 미통지 시 손해 증가분 미보상</li>
                </ul>
              </div>

              <div className="en-actions">
                <button className="t-btn t-btn-ghost" onClick={() => navigate('/student/department')}>
                  안전교육 시작하기
                </button>
                <button className="t-btn t-btn-primary" onClick={() => navigate('/insurance/simulator')}>
                  내가 받을 수 있는 보상은?
                </button>
              </div>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}

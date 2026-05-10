import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEPARTMENT_LIST } from '../data/departments';
import { INCIDENT_CASES } from '../data/incidentCases';
import './ClaimSubmitPage.css';

// 「연구실안전공제」 약관 제11조 사고 통지 + 보상금 청구 의사 접수 폼.
// 학생이 사고 후 신속히 통지·청구 의사를 접수하고, 한국교육시설안전원에 14일 이내
// 전달되도록 기록을 남김. (실제 보상은 사고조사·면책사유 검토 후 결정)

const INJURY_LEVELS = [
  { id: 'first-aid', label: '응급처치만', desc: '병원 진료 없음', tone: 'gray' },
  { id: 'outpatient', label: '통원 치료', desc: '3일 미만 통원', tone: 'blue' },
  { id: 'admit-3-7', label: '입원 3~7일', desc: '단기 입원', tone: 'orange' },
  { id: 'admit-8+', label: '입원 8일 이상', desc: '15일+ 시 등록금 지원 가능', tone: 'orange' },
  { id: 'disability', label: '후유장해', desc: '별표1 1~14급', tone: 'red' },
  { id: 'fatal', label: '사망', desc: '유족급여 2억', tone: 'red' },
];

const REQUIRED_DOCS = [
  '진료기록사본 또는 진단서',
  '치료비 영수증 (요양급여 청구 시)',
  '입·퇴원 확인서 (입원급여 청구 시)',
  '연구활동 증빙 (지도교수 확인서 또는 출석부)',
  '사고경위서 (실습실 책임자 확인 서명)',
];

export default function ClaimSubmitPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    studentNo: '',
    name: '',
    deptId: '',
    incidentDate: '',
    incidentLocation: '',
    incidentType: '',
    injuryLevel: '',
    description: '',
    estimatedCost: '',
    consent: false,
  });
  const [submitted, setSubmitted] = useState(null);

  const valid = useMemo(() => {
    return (
      form.studentNo.trim().length >= 8 &&
      form.name.trim().length >= 2 &&
      form.deptId &&
      form.incidentDate &&
      form.incidentLocation.trim().length >= 2 &&
      form.injuryLevel &&
      form.description.trim().length >= 20 &&
      form.consent
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
      claimedAt: new Date().toISOString(),
      receiptNo: 'CLM-' + Date.now().toString().slice(-8),
      status: '접수완료',
      reviewDeadline: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
    };
    try {
      localStorage.setItem(`safelab.claim.${record.receiptNo}`, JSON.stringify(record));
    } catch {}
    setSubmitted(record);
    setStep(3);
  };

  const lvl = INJURY_LEVELS.find((l) => l.id === form.injuryLevel);

  return (
    <div className="app-shell">
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />

      <div className="cl-frame">
        <header className="cl-header">
          <button className="cl-back" onClick={() => navigate(-1)} aria-label="뒤로">←</button>
          <div className="cl-header__title">
            <h1>연구실안전공제 보상 청구</h1>
            <p>약관 제11조 — 사고 인지 즉시 통지 의무 / 한국교육시설안전원 14일 이내 전달</p>
          </div>
          <div className="cl-header__right" />
        </header>

        <main className="cl-main">
          {/* Notice */}
          <article className="cl-notice">
            <span className="cl-notice__icon">⚠️</span>
            <div>
              <strong>사고 인지 즉시 통지 의무</strong>
              <p>
                약관 제11조에 따라 사고를 안 때는 <strong>지체 없이</strong> 안전원에 통지해야 합니다.
                통지를 게을리하여 손해가 증가한 경우 그 증가분은 보상받지 못할 수 있습니다.
              </p>
            </div>
          </article>

          {step !== 3 && (
            <>
              <div className="cl-section__head">
                <span className="eyebrow">Step 1 · 사고 청구</span>
                <h2>본인·사고 정보 입력</h2>
                <p>아래 정보로 한국교육시설안전원에 청구 의사를 접수합니다.</p>
              </div>

              <form className="glass-card cl-form" onSubmit={submit}>
                {/* 본인 정보 */}
                <fieldset className="cl-fieldset">
                  <legend>👤 본인 정보</legend>
                  <div className="cl-grid-2">
                    <label className="cl-field">
                      <span>학번 *</span>
                      <input type="text" inputMode="numeric" value={form.studentNo} onChange={update('studentNo')} required />
                    </label>
                    <label className="cl-field">
                      <span>이름 *</span>
                      <input type="text" value={form.name} onChange={update('name')} required />
                    </label>
                    <label className="cl-field">
                      <span>학과 *</span>
                      <select value={form.deptId} onChange={update('deptId')} required>
                        <option value="">선택하세요</option>
                        {DEPARTMENT_LIST.map((d) => (
                          <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </fieldset>

                {/* 사고 정보 */}
                <fieldset className="cl-fieldset">
                  <legend>📅 사고 정보</legend>
                  <div className="cl-grid-2">
                    <label className="cl-field">
                      <span>사고 일자 *</span>
                      <input type="date" value={form.incidentDate} onChange={update('incidentDate')} required />
                    </label>
                    <label className="cl-field">
                      <span>사고 장소 *</span>
                      <input type="text" placeholder="예: 11호관 305호 화학실험실" value={form.incidentLocation} onChange={update('incidentLocation')} required />
                    </label>
                    <label className="cl-field cl-field--full">
                      <span>사고 유형 (선택)</span>
                      <select value={form.incidentType} onChange={update('incidentType')}>
                        <option value="">유형을 선택하지 않음</option>
                        <optgroup label="화학">
                          <option value="chemical-burn">화학 화상</option>
                          <option value="chemical-toxic">화학물질 흡입·중독</option>
                          <option value="chemical-explosion">화학 폭발</option>
                        </optgroup>
                        <optgroup label="기계">
                          <option value="mechanical-cut">베임·창상</option>
                          <option value="mechanical-amputate">절단</option>
                          <option value="mechanical-trap">끼임·말림</option>
                        </optgroup>
                        <optgroup label="전기·열">
                          <option value="electric-shock">감전</option>
                          <option value="electric-fire">전기 화재</option>
                          <option value="thermal-burn">열 화상</option>
                        </optgroup>
                        <optgroup label="기타">
                          <option value="gas-leak">가스 누출</option>
                          <option value="other">기타</option>
                        </optgroup>
                      </select>
                    </label>
                    <label className="cl-field cl-field--full">
                      <span>사고 경위 *</span>
                      <textarea rows="4" placeholder="실험 종료 후 정리 중 / 어떤 작업 / 어떻게 부상 / 응급조치 여부 등 (20자 이상)"
                        value={form.description} onChange={update('description')} required />
                      <small className="cl-field__count">{form.description.length}자</small>
                    </label>
                  </div>
                </fieldset>

                {/* 부상 정도 */}
                <fieldset className="cl-fieldset">
                  <legend>🩺 부상 정도 *</legend>
                  <div className="cl-injury-grid">
                    {INJURY_LEVELS.map((l) => (
                      <label key={l.id} className={`cl-injury cl-injury--${l.tone} ${form.injuryLevel === l.id ? 'is-active' : ''}`}>
                        <input type="radio" name="injuryLevel" value={l.id}
                          checked={form.injuryLevel === l.id} onChange={update('injuryLevel')} />
                        <strong>{l.label}</strong>
                        <small>{l.desc}</small>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* 비용 (선택) */}
                <fieldset className="cl-fieldset">
                  <legend>💰 청구 예상액 (선택)</legend>
                  <label className="cl-field">
                    <span>치료비·기타 손해액 (원)</span>
                    <input type="number" inputMode="numeric" placeholder="500000"
                      value={form.estimatedCost} onChange={update('estimatedCost')} />
                    <small className="cl-field__hint">정확한 보상액은 약관·면책사유 검토 후 결정됩니다.</small>
                  </label>
                </fieldset>

                {/* 동의 */}
                <fieldset className="cl-fieldset">
                  <legend>📜 청구 의사 확인 *</legend>
                  <label className="cl-consent">
                    <input type="checkbox" checked={form.consent} onChange={update('consent')} />
                    <span>
                      <strong>위 내용으로 「연구실안전공제」 보상 청구 접수를 신청합니다.</strong>
                      <small>
                        본 청구는 약관 제3조(보상하는 손해)·제10조(면책사유)·제11조(통지의무)에 따라 검토되며, 허위·과장 청구 시 약관 위반으로 보상이 거절될 수 있습니다.
                        제출 후 14일 이내 한국교육시설안전원(02-6710-1700)에서 본인 확인 연락이 옵니다.
                      </small>
                    </span>
                  </label>
                </fieldset>

                <div className="cl-actions">
                  <button type="button" className="t-btn t-btn-ghost" onClick={() => navigate('/insurance/simulator')}>
                    먼저 시뮬레이션 해보기
                  </button>
                  <button type="submit" className="t-btn t-btn-primary" disabled={!valid}>
                    {valid ? '보상 청구 접수' : '필수 항목을 모두 입력해주세요'}
                  </button>
                </div>
              </form>

              {/* 필요 서류 안내 */}
              <article className="glass-card cl-docs">
                <h3>📋 청구 시 함께 준비해야 할 서류</h3>
                <ol>
                  {REQUIRED_DOCS.map((d, i) => <li key={i}>{d}</li>)}
                </ol>
                <p>
                  서류는 한국교육시설안전원 본인 확인 연락 후 직접 제출/이메일/팩스로 송부합니다.
                  본 화면에서는 <strong>청구 의사 접수</strong>만 진행하며 서류 첨부는 추후 단계입니다.
                </p>
              </article>
            </>
          )}

          {/* Step 3: 완료 */}
          {step === 3 && submitted && (
            <article className="glass-card cl-done">
              <div className="cl-done__check">✓</div>
              <h2>보상 청구 접수 완료</h2>
              <p>
                <strong>{submitted.name}</strong>님 (학번 {submitted.studentNo}) 의 사고 청구 의사가 접수되었습니다.
                약관 제11조 통지 의무가 이행되었으며, 손해 증가분 미보상 위험이 해소됩니다.
              </p>

              <dl className="cl-done__dl">
                <div><dt>접수번호</dt><dd>{submitted.receiptNo}</dd></div>
                <div><dt>접수일시</dt><dd>{new Date(submitted.claimedAt).toLocaleString('ko-KR')}</dd></div>
                <div><dt>사고 일자</dt><dd>{submitted.incidentDate}</dd></div>
                <div><dt>부상 정도</dt><dd>{lvl?.label}</dd></div>
                <div><dt>14일 이내 연락 예정일</dt><dd>{new Date(submitted.reviewDeadline).toLocaleDateString('ko-KR')}</dd></div>
                <div><dt>상태</dt><dd>{submitted.status}</dd></div>
              </dl>

              <div className="cl-done__notice">
                <strong>다음 단계</strong>
                <ul>
                  <li>한국교육시설안전원 (☎ 02-6710-1700) 에서 14일 이내 본인 확인 연락</li>
                  <li>위 5종 서류 준비 → 안전원 안내에 따라 제출</li>
                  <li>약관 검토 후 요양·입원·장해·유족급여 결정 (실수령액은 자기부담금 차감)</li>
                  <li>학사지원팀 (☎ 032-870-2030) 에 사고 보고서 함께 제출 (인하공전 내규)</li>
                </ul>
              </div>

              <div className="cl-actions">
                <button className="t-btn t-btn-ghost" onClick={() => navigate('/safety/cases')}>
                  유사 사고사례 보기
                </button>
                <button className="t-btn t-btn-primary" onClick={() => navigate('/emergency')}>
                  비상 연락처 보기
                </button>
              </div>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}

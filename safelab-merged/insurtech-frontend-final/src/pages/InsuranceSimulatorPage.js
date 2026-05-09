import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  INSURANCE_PLANS,
  INSURANCE_PLAN_LIST,
  INJURY_SEVERITIES,
  simulateClaim,
} from '../data/insurancePlans';
import { INCIDENT_TYPES } from '../data/incidentTypes';
import './InsuranceSimulatorPage.css';

// 「내가 받을 수 있는 보상은?」 — 보험 보상 시뮬레이터 (C 패키지)
// 출처: PDF p.68~70 인하공전 가입 4종 보험 + 약관 제3~11조

const formatKrw = (n) => {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억`;
  if (n >= 10_000) return `${(n / 10_000).toFixed(0)}만`;
  return n.toLocaleString();
};

const ALL_PLAN_IDS = Object.keys(INSURANCE_PLANS);

export default function InsuranceSimulatorPage() {
  const navigate = useNavigate();
  const [incidentTypeId, setIncidentTypeId] = useState('chemical_burn');
  const [severityId, setSeverityId] = useState('admit_short');
  // 기본: 4종 모두 가입 가정 (인하공전 학생은 자동 4종 가입됨 - PDF p.68)
  const [planIds, setPlanIds] = useState(ALL_PLAN_IDS);

  const result = useMemo(
    () => simulateClaim({ severityId, planIds }),
    [severityId, planIds],
  );

  const togglePlan = (id) => {
    setPlanIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const incident = INCIDENT_TYPES[incidentTypeId];
  const severity = INJURY_SEVERITIES.find((s) => s.id === severityId);

  return (
    <div className="app-shell">
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />

      <div className="is-frame">
        <header className="is-header">
          <button className="is-back" onClick={() => navigate(-1)} aria-label="뒤로">
            ←
          </button>
          <div className="is-header__title">
            <h1>보험 보상 시뮬레이터</h1>
            <p>인하공전 가입 4종 보험 — 사고 입력 시 받을 수 있는 보상액 추정</p>
          </div>
          <div className="is-header__right" />
        </header>

        <main className="is-main">
          {/* 좌측 입력 폼 + 우측 결과 */}
          <div className="is-grid">
            <div className="is-form">
              {/* Step 1: 사고 유형 */}
              <section>
                <div className="is-section__head">
                  <span className="eyebrow">Step 1</span>
                  <h2>사고 유형</h2>
                  <p>사진 사고 인식 7종 중 선택</p>
                </div>
                <div className="is-incident-grid">
                  {Object.values(INCIDENT_TYPES).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`is-incident ${incidentTypeId === t.id ? 'is-active' : ''}`}
                      onClick={() => setIncidentTypeId(t.id)}
                    >
                      <span className="is-incident__icon">{t.icon}</span>
                      <span className="is-incident__name">{t.name}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Step 2: 부상 정도 */}
              <section>
                <div className="is-section__head">
                  <span className="eyebrow">Step 2</span>
                  <h2>부상 정도</h2>
                  <p>치료 기간·입원 일수에 따라 보상이 달라짐</p>
                </div>
                <div className="is-severity-list">
                  {INJURY_SEVERITIES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`is-severity ${severityId === s.id ? 'is-active' : ''}`}
                      onClick={() => setSeverityId(s.id)}
                    >
                      <span className="is-severity__icon">{s.icon}</span>
                      <div className="is-severity__body">
                        <strong>{s.label}</strong>
                        <small>{s.desc}</small>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Step 3: 가입 보험 */}
              <section>
                <div className="is-section__head">
                  <span className="eyebrow">Step 3</span>
                  <h2>가입 보험 (공제)</h2>
                  <p>인하공전 학생은 4종 모두 자동 가입됨 (PDF p.68)</p>
                </div>
                <div className="is-plan-list">
                  {INSURANCE_PLAN_LIST.map((p) => (
                    <label key={p.id} className={`is-plan ${planIds.includes(p.id) ? 'is-active' : ''}`}>
                      <input
                        type="checkbox"
                        checked={planIds.includes(p.id)}
                        onChange={() => togglePlan(p.id)}
                      />
                      <span className="is-plan__icon">{p.icon}</span>
                      <div className="is-plan__body">
                        <strong>{p.name}</strong>
                        <small>{p.legalBasis}</small>
                        <small>{p.coversWho}</small>
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            {/* 결과 */}
            <aside className="is-result-wrap">
              <div className="is-result is-sticky">
                <div className="is-result__head">
                  <span className="eyebrow">예상 보상액</span>
                  <p className="is-result__amount">{formatKrw(result?.totalNet || 0)}원</p>
                  <p className="is-result__sub">
                    {incident.icon} {incident.name} · {severity.icon} {severity.label}
                  </p>
                </div>

                <div className="is-result__detail">
                  <h3>적용 항목 {result?.lines.length || 0}건</h3>
                  {result && result.lines.length === 0 && (
                    <p className="is-result__empty">
                      현재 입력된 사고 정도에서는 적용되는 보상 항목이 없습니다.
                      <br />부상 정도를 더 심각하게 또는 가입 보험을 추가해보세요.
                    </p>
                  )}
                  <ul className="is-lines">
                    {result?.lines.map((l, i) => (
                      <li key={i} className="is-line">
                        <div className="is-line__top">
                          <span className="is-line__benefit">{l.benefit}</span>
                          <strong className="is-line__amount">{formatKrw(l.amount)}원</strong>
                        </div>
                        <div className="is-line__plan">{l.planName}</div>
                        <p className="is-line__formula">{l.formula}</p>
                        {l.deductible > 0 && (
                          <p className="is-line__deductible">
                            ※ 자기부담금 {formatKrw(l.deductible)}원 차감
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="is-result__totals">
                  <div className="is-totals-row">
                    <span>합계 (자기부담 차감 전)</span>
                    <strong>{formatKrw(result?.totalGross || 0)}원</strong>
                  </div>
                  {(result?.totalDeductible || 0) > 0 && (
                    <div className="is-totals-row">
                      <span>자기부담금</span>
                      <strong>−{formatKrw(result.totalDeductible)}원</strong>
                    </div>
                  )}
                  <div className="is-totals-row is-totals-row--final">
                    <span>실수령액</span>
                    <strong>{formatKrw(result?.totalNet || 0)}원</strong>
                  </div>
                </div>

                <p className="is-disclaimer">
                  ※ 본 계산은 시뮬레이션입니다. 실제 보상은 사고 조사·약관 면책사유 검토(고의·중과실 등) 후 결정됩니다.
                  사고 인지 즉시 한국교육시설안전원에 통지해야 보상 가능 (약관 제11조).
                </p>

                <div className="is-result__cta">
                  <button
                    className="t-btn t-btn-primary"
                    onClick={() => navigate('/insurance/consult')}
                  >
                    📞 공제 상담 시작
                  </button>
                  <button
                    className="t-btn t-btn-ghost"
                    onClick={() => navigate('/emergency')}
                  >
                    🚨 긴급 연락처
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

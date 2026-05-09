import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  INCIDENT_CASES,
  CASE_CATEGORIES,
  SEVERITY_COLORS,
  CASE_STATS,
} from '../data/incidentCases';
import { DEPARTMENT_LIST } from '../data/departments';
import './IncidentCasesPage.css';

// 「2026 안전교육자료」 PDF p.49~58 사고사례 10건 라이브러리.

export default function IncidentCasesPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('전체');
  const [deptFilter, setDeptFilter] = useState('');
  const [active, setActive] = useState(null);

  const filtered = useMemo(() => {
    return INCIDENT_CASES.filter((c) => {
      if (category !== '전체' && c.category !== category) return false;
      if (deptFilter && !c.deptTags.includes(deptFilter)) return false;
      return true;
    });
  }, [category, deptFilter]);

  const activeCase = active ? INCIDENT_CASES.find((c) => c.id === active) : null;

  return (
    <div className="app-shell">
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />

      <div className="ic-frame">
        <header className="ic-header">
          <button className="ic-back" onClick={() => navigate(-1)} aria-label="뒤로">
            ←
          </button>
          <div className="ic-header__title">
            <h1>실습실 사고사례 라이브러리</h1>
            <p>「인하공전 2026 안전교육자료」 p.49~58 — 실제 발생한 10건의 사고를 학습하세요</p>
          </div>
          <div className="ic-header__right" />
        </header>

        <main className="ic-main">
          {/* KPI 통계 */}
          <section>
            <div className="ic-section__head">
              <span className="eyebrow">Step 1 · Overview</span>
              <h2>사고사례 분포</h2>
              <p>10건 중 사망 1건, 중대 6건, 중상 2건, 경상 1건 — 면장갑·MSDS 미숙지가 핵심 원인</p>
            </div>
            <div className="ic-kpi-grid">
              <article className="ic-kpi">
                <span className="ic-kpi__label">총 사례</span>
                <span className="ic-kpi__value">{CASE_STATS.total}<small>건</small></span>
                <span className="ic-kpi__sub">PDF p.49~58</span>
              </article>
              <article className="ic-kpi ic-kpi--critical">
                <span className="ic-kpi__label">사망 사고</span>
                <span className="ic-kpi__value">{CASE_STATS.fatalities}<small>건</small></span>
                <span className="ic-kpi__sub">사례 9 — 가스 누출 폭발</span>
              </article>
              <article className="ic-kpi ic-kpi--info">
                <span className="ic-kpi__label">최다 카테고리</span>
                <span className="ic-kpi__value-text">화학</span>
                <span className="ic-kpi__sub">{CASE_STATS.byCategory['화학']}건 — MSDS 미숙지 다수</span>
              </article>
              <article className="ic-kpi ic-kpi--warn">
                <span className="ic-kpi__label">기계 사고</span>
                <span className="ic-kpi__value">{CASE_STATS.byCategory['기계'] || 0}<small>건</small></span>
                <span className="ic-kpi__sub">면장갑·방호가드 미설치</span>
              </article>
            </div>
          </section>

          {/* 핵심 교훈 */}
          <section>
            <div className="ic-section__head">
              <span className="eyebrow">Top Lessons</span>
              <h2>10건이 가르쳐주는 4가지 교훈</h2>
            </div>
            <ul className="ic-lessons">
              {CASE_STATS.topLessons.map((l, i) => (
                <li key={i} className="ic-lesson">
                  <span className="ic-lesson__num">{i + 1}</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 필터 + 사례 그리드 */}
          <section>
            <div className="ic-section__head">
              <span className="eyebrow">Step 2 · Browse</span>
              <h2>사례 둘러보기</h2>
              <p>카테고리·학과로 좁혀서 클릭하면 원인·피해·교훈이 펼쳐집니다.</p>
            </div>

            <div className="ic-toolbar">
              <div className="ic-chips">
                {CASE_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`ic-chip ${category === c ? 'is-active' : ''}`}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="ic-chips ic-chips--secondary">
                <button
                  type="button"
                  className={`ic-chip ${deptFilter === '' ? 'is-active' : ''}`}
                  onClick={() => setDeptFilter('')}
                >
                  전 학과
                </button>
                {DEPARTMENT_LIST.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className={`ic-chip ${deptFilter === d.id ? 'is-active' : ''}`}
                    onClick={() => setDeptFilter(d.id)}
                  >
                    {d.icon} {d.shortName}
                  </button>
                ))}
              </div>
              <div className="ic-meta">총 {filtered.length}건 표시</div>
            </div>

            <div className="ic-grid">
              {filtered.map((c) => {
                const sev = SEVERITY_COLORS[c.severity];
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`ic-card ic-card--${sev.tone} ${active === c.id ? 'is-active' : ''}`}
                    onClick={() => setActive(active === c.id ? null : c.id)}
                  >
                    <div className="ic-card__top">
                      <span className="ic-card__no">사례 {c.no}</span>
                      <span className={`pill ${pillClass(sev.tone)}`}>{sev.label}</span>
                    </div>
                    <div className="ic-card__hero">
                      <span className="ic-card__icon">{c.icon}</span>
                      <div>
                        <h3 className="ic-card__title">{c.title}</h3>
                        <p className="ic-card__cat">{c.category} · {c.location}</p>
                      </div>
                    </div>
                    <p className="ic-card__sum">{c.summary}</p>
                  </button>
                );
              })}
              {filtered.length === 0 && <p className="ic-empty">조건에 맞는 사례가 없습니다.</p>}
            </div>
          </section>

          {/* Detail */}
          {activeCase && (
            <section className="ic-detail">
              <div className="ic-section__head">
                <span className="eyebrow">Step 3 · Deep Dive</span>
                <h2>
                  <span className="ic-detail__icon">{activeCase.icon}</span> 사례 {activeCase.no} — {activeCase.title}
                </h2>
              </div>
              <CaseDetail c={activeCase} />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function pillClass(tone) {
  switch (tone) {
    case 'red': return 'pill-red';
    case 'orange': return 'pill-orange';
    case 'gray': return 'pill-gray';
    default: return 'pill-gray';
  }
}

function CaseDetail({ c }) {
  return (
    <div className="ic-detail__grid">
      <article className="glass-card">
        <h3 className="card-title">📋 사고 개요</h3>
        <p className="ic-detail__text">{c.summary}</p>
        <dl className="ic-detail__dl">
          <div><dt>장소</dt><dd>{c.location}</dd></div>
          <div><dt>카테고리</dt><dd>{c.category}</dd></div>
          <div><dt>인적 피해</dt><dd>{c.damages.injury}</dd></div>
          <div><dt>물적 피해</dt><dd>{c.damages.property}</dd></div>
        </dl>
      </article>

      <article className="glass-card">
        <h3 className="card-title">🔍 사고 원인</h3>
        <div className="ic-detail__cause">
          <h4>직접 원인</h4>
          <p>{c.causes.direct}</p>
          <h4>간접 원인</h4>
          <ul>
            {c.causes.indirect.map((i, idx) => <li key={idx}>{i}</li>)}
          </ul>
        </div>
      </article>

      <article className="glass-card">
        <h3 className="card-title">💡 교훈</h3>
        <ol className="ic-detail__lessons">
          {c.lessons.map((l, idx) => (
            <li key={idx}>{l}</li>
          ))}
        </ol>
      </article>

      <article className="glass-card">
        <h3 className="card-title">💰 적용 가능 보장</h3>
        <p className="ic-detail__cov-note">
          이 사고가 인하공전에서 발생했다면 다음 보장이 적용됩니다:
        </p>
        <div className="ic-detail__coverage">
          {c.coverage.map((cov) => (
            <span key={cov} className="ic-cov-pill">{cov}</span>
          ))}
        </div>
        <p className="ic-detail__cov-foot">
          ※ 약관 제3조 / 별표1 후유장해 / 한국교육시설안전원 「연구실안전공제」
        </p>
      </article>
    </div>
  );
}

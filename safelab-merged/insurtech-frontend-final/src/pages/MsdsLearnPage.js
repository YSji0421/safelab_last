import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MSDS_SECTIONS,
  GHS_PICTOGRAMS,
  SAMPLE_CHEMICALS,
  MSDS_STATS,
} from '../data/msds';
import { getCase } from '../data/incidentCases';
import './MsdsLearnPage.css';

// 「2026 안전교육자료」 PDF p.59~86 MSDS 학습 페이지.

const KEY_FOR_FILTERS = ['전체', '취급 전', '사고 시', '폐기', '운송', '관리'];

export default function MsdsLearnPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(2); // 기본: 2번 유해성·위험성
  const [keyForFilter, setKeyForFilter] = useState('전체');
  const [activeChem, setActiveChem] = useState('sodium-azide');

  const filteredSections = useMemo(() => {
    if (keyForFilter === '전체') return MSDS_SECTIONS;
    return MSDS_SECTIONS.filter((s) => s.keyFor === keyForFilter);
  }, [keyForFilter]);

  const section = MSDS_SECTIONS.find((s) => s.no === activeSection);
  const chem = SAMPLE_CHEMICALS.find((c) => c.id === activeChem);
  const linkedCase = chem?.incident ? getCase(chem.incident) : null;

  return (
    <div className="app-shell">
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />

      <div className="ms-frame">
        <header className="ms-header">
          <button className="ms-back" onClick={() => navigate(-1)} aria-label="뒤로">
            ←
          </button>
          <div className="ms-header__title">
            <h1>MSDS 학습 — 화학물질 안전 표준</h1>
            <p>「인하공전 2026 안전교육자료」 p.{MSDS_STATS.pdfPages} — 16개 항목 + GHS 그림문자 9종</p>
          </div>
          <div className="ms-header__right" />
        </header>

        <main className="ms-main">
          {/* Step 1: 개요 */}
          <section>
            <div className="ms-section__head">
              <span className="eyebrow">Step 1 · Overview</span>
              <h2>MSDS는 화학물질의 신분증입니다</h2>
              <p>
                MSDS(물질안전보건자료)는 화학물질의 유해·위험 정보를 16개 항목 72개 세부항목으로 정리한
                국제 표준 자료입니다. 사고 사례 10건 중 5건이 MSDS 미숙지로 발생했습니다.
              </p>
            </div>
            <div className="ms-kpi-grid">
              <article className="ms-kpi">
                <span className="ms-kpi__label">MSDS 항목</span>
                <span className="ms-kpi__value">{MSDS_STATS.totalSections}<small>개</small></span>
                <span className="ms-kpi__sub">국제 표준 GHS</span>
              </article>
              <article className="ms-kpi ms-kpi--warn">
                <span className="ms-kpi__label">GHS 그림문자</span>
                <span className="ms-kpi__value">{MSDS_STATS.totalPictograms}<small>종</small></span>
                <span className="ms-kpi__sub">유해·위험성 시각 분류</span>
              </article>
              <article className="ms-kpi ms-kpi--info">
                <span className="ms-kpi__label">시연 화학물질</span>
                <span className="ms-kpi__value">{MSDS_STATS.sampleChemicals}<small>종</small></span>
                <span className="ms-kpi__sub">PDF 사례 등장 시약</span>
              </article>
              <article className="ms-kpi ms-kpi--critical">
                <span className="ms-kpi__label">MSDS 미숙지 사고</span>
                <span className="ms-kpi__value">5<small>/10건</small></span>
                <span className="ms-kpi__sub">사례 2·5·6·9·10</span>
              </article>
            </div>
          </section>

          {/* Step 2: GHS 그림문자 */}
          <section>
            <div className="ms-section__head">
              <span className="eyebrow">Step 2 · GHS Pictograms</span>
              <h2>9개 그림문자 한눈에</h2>
              <p>화학물질 용기·포장에 부착되는 마름모꼴 빨간 테두리 그림문자.</p>
            </div>
            <div className="ms-pict-grid">
              {GHS_PICTOGRAMS.map((p) => (
                <article key={p.id} className="ms-pict">
                  <div className="ms-pict__icon">{p.symbol}</div>
                  <h3 className="ms-pict__name">{p.name}</h3>
                  <p className="ms-pict__meaning">{p.meaning}</p>
                  <p className="ms-pict__ex">예: {p.examples}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Step 3: 16개 항목 */}
          <section>
            <div className="ms-section__head">
              <span className="eyebrow">Step 3 · 16 Sections</span>
              <h2>MSDS 16개 항목</h2>
              <p>항목을 클릭하면 우측에 상세 설명이 표시됩니다.</p>
            </div>

            <div className="ms-chips">
              {KEY_FOR_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`ms-chip ${keyForFilter === f ? 'is-active' : ''}`}
                  onClick={() => setKeyForFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="ms-section-grid">
              <div className="ms-section-list">
                {filteredSections.map((s) => (
                  <button
                    key={s.no}
                    type="button"
                    className={`ms-sec-row ${activeSection === s.no ? 'is-active' : ''}`}
                    onClick={() => setActiveSection(s.no)}
                  >
                    <span className="ms-sec-row__num">{String(s.no).padStart(2, '0')}</span>
                    <span className="ms-sec-row__icon">{s.icon}</span>
                    <div className="ms-sec-row__body">
                      <strong>{s.title}</strong>
                      <small>{s.keyFor}</small>
                    </div>
                  </button>
                ))}
              </div>

              <article className="ms-sec-detail glass-card">
                {section && (
                  <>
                    <div className="ms-sec-detail__head">
                      <span className="ms-sec-detail__num">제 {section.no} 항목</span>
                      <h3>
                        <span className="ms-sec-detail__icon">{section.icon}</span>
                        {section.title}
                      </h3>
                    </div>
                    <p className="ms-sec-detail__desc">{section.desc}</p>
                    <div className="ms-sec-detail__detail">
                      <h4>왜 중요한가</h4>
                      <p>{section.detail}</p>
                    </div>
                    <div className="ms-sec-detail__chip">
                      활용 단계 · <strong>{section.keyFor}</strong>
                    </div>
                  </>
                )}
              </article>
            </div>
          </section>

          {/* Step 4: 실제 화학물질 예시 */}
          <section>
            <div className="ms-section__head">
              <span className="eyebrow">Step 4 · Real Chemicals</span>
              <h2>PDF 사고사례에 등장한 화학물질</h2>
              <p>학생이 실제 마주칠 수 있는 5종 — 클릭하면 MSDS 핵심 항목과 연결된 사고가 표시됩니다.</p>
            </div>

            <div className="ms-chem-row">
              {SAMPLE_CHEMICALS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`ms-chem-tab ${activeChem === c.id ? 'is-active' : ''}`}
                  onClick={() => setActiveChem(c.id)}
                >
                  <strong>{c.formula}</strong>
                  <small>{c.name.split(' ')[0]}</small>
                </button>
              ))}
            </div>

            {chem && (
              <article className="ms-chem-card glass-card">
                <div className="ms-chem-card__head">
                  <div>
                    <h3>{chem.name}</h3>
                    <p className="ms-chem-card__meta">
                      분자식 <code>{chem.formula}</code> · CAS No. <code>{chem.casNo}</code>
                    </p>
                  </div>
                  <div className="ms-chem-card__hazards">
                    {chem.keyHazards.map((hid) => {
                      const p = GHS_PICTOGRAMS.find((x) => x.id === hid);
                      return p ? (
                        <span key={hid} className="ms-chem-card__hazard" title={p.name}>
                          {p.symbol}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                <div className="ms-chem-card__highlights">
                  <h4>MSDS 핵심 항목</h4>
                  <ul>
                    {Object.entries(chem.msdsHighlights).map(([no, hl]) => {
                      const sec = MSDS_SECTIONS.find((s) => s.no === Number(no));
                      return (
                        <li key={no}>
                          <span className="ms-chem-card__hl-num">제 {no} 항목 · {sec?.title}</span>
                          <span>{hl}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {linkedCase && (
                  <div className="ms-chem-card__case">
                    <h4>🔗 연결된 실제 사고</h4>
                    <p>
                      <strong>사례 {linkedCase.no}.</strong> {linkedCase.title} — {linkedCase.location}
                    </p>
                    <p className="ms-chem-card__case-sum">{linkedCase.summary}</p>
                    <button
                      type="button"
                      className="t-btn t-btn-ghost"
                      onClick={() => navigate('/safety/cases')}
                    >
                      📚 사고사례 라이브러리에서 자세히 →
                    </button>
                  </div>
                )}
              </article>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

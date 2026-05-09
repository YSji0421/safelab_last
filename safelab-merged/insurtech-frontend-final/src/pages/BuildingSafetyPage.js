import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BUILDINGS,
  GRADE_META,
  STATS,
  NEAREST_HOSPITAL,
  getSafetyGrade,
  getBuildingsByDept,
} from '../data/buildings';
import { getDepartment, DEPARTMENT_LIST } from '../data/departments';
import './BuildingSafetyPage.css';

// 「내 강의실 안전등급」 — 인하공전 25개 캠퍼스 건물 안전 인증·내진 평가 검색.
// 데이터 출처: 「2026 대학안전관리계획」 PDF p.30 표 그대로.

const FILTERS = [
  { id: 'all', label: '전체', test: () => true },
  { id: 'certified', label: '인증 완료', test: (b) => !!b.certified },
  { id: 'pending', label: '인증 미적용', test: (b) => !b.certified },
  { id: 'seismic', label: '내진평가 예정', test: (b) => !!b.seismicScheduled },
];

export default function BuildingSafetyPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState(''); // '' = 전체
  const [active, setActive] = useState(null); // 클릭한 건물 id

  const filtered = useMemo(() => {
    const f = FILTERS.find((x) => x.id === filter)?.test || (() => true);
    const q = query.trim().toLowerCase();
    return BUILDINGS.filter(f)
      .filter((b) => (deptFilter ? b.usedBy.includes(deptFilter) : true))
      .filter((b) =>
        q ? b.name.toLowerCase().includes(q) || (b.note || '').toLowerCase().includes(q) : true,
      );
  }, [query, filter, deptFilter]);

  const activeBuilding = active ? BUILDINGS.find((b) => b.id === active) : null;

  return (
    <div className="app-shell">
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />

      <div className="bs-frame">
        <header className="bs-header">
          <button className="bs-back" onClick={() => navigate(-1)} aria-label="뒤로">
            ←
          </button>
          <div className="bs-header__title">
            <h1>캠퍼스 건물 안전등급</h1>
            <p>인하공전 25개 동 — 교육시설안전 인증 + 내진성능평가 현황</p>
          </div>
          <div className="bs-header__right" />
        </header>

        <main className="bs-main">
          {/* Step 1 — KPI 통계 */}
          <section>
            <div className="bs-section__head">
              <span className="eyebrow">Step 1 · Overview</span>
              <h2>한눈에 보는 캠퍼스 안전</h2>
              <p>「인하공전 2026 대학안전관리계획」 PDF p.30 기준 — 발행일 2026.2</p>
            </div>
            <div className="bs-kpi-grid">
              <article className="bs-kpi">
                <span className="bs-kpi__label">총 건물</span>
                <span className="bs-kpi__value">{STATS.total}<small>동</small></span>
                <span className="bs-kpi__sub">총 면적 {STATS.totalArea.toLocaleString()}㎡</span>
              </article>
              <article className="bs-kpi bs-kpi--good">
                <span className="bs-kpi__label">교육시설안전 인증</span>
                <span className="bs-kpi__value">{STATS.certified}<small>/{STATS.total}</small></span>
                <span className="bs-kpi__sub">「교육시설법」 제13조 기준</span>
              </article>
              <article className="bs-kpi bs-kpi--info">
                <span className="bs-kpi__label">내진성능평가 예정</span>
                <span className="bs-kpi__value">{STATS.seismicScheduled}<small>동</small></span>
                <span className="bs-kpi__sub">2026년 11호관·생활관 실시</span>
              </article>
              <article className="bs-kpi">
                <span className="bs-kpi__label">최고령 → 최신</span>
                <span className="bs-kpi__value">{STATS.oldest}<small>~{STATS.newest}</small></span>
                <span className="bs-kpi__sub">건축연도 범위</span>
              </article>
            </div>
          </section>

          {/* Step 2 — 검색·필터 */}
          <section>
            <div className="bs-section__head">
              <span className="eyebrow">Step 2 · Search</span>
              <h2>내 강의실 찾기</h2>
              <p>이름·메모로 검색하거나 학과·인증 여부로 좁혀보세요.</p>
            </div>

            <div className="bs-toolbar">
              <input
                type="search"
                className="bs-search"
                placeholder="🔍 본관, 11호관, 생활관…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="bs-chips">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`bs-chip ${filter === f.id ? 'is-active' : ''}`}
                    onClick={() => setFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="bs-chips bs-chips--secondary">
                <button
                  type="button"
                  className={`bs-chip ${deptFilter === '' ? 'is-active' : ''}`}
                  onClick={() => setDeptFilter('')}
                >
                  전 학과
                </button>
                {DEPARTMENT_LIST.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className={`bs-chip ${deptFilter === d.id ? 'is-active' : ''}`}
                    onClick={() => setDeptFilter(d.id)}
                  >
                    {d.icon} {d.shortName}
                  </button>
                ))}
              </div>
            </div>

            <div className="bs-meta">
              <span>총 {filtered.length}동 표시 (전체 {STATS.total}동)</span>
            </div>

            <div className="bs-grid">
              {filtered.map((b) => {
                const grade = getSafetyGrade(b);
                const meta = GRADE_META[grade];
                const age = 2026 - b.built;
                return (
                  <button
                    key={b.id}
                    type="button"
                    className={`bs-card bs-card--${meta.tone} ${active === b.id ? 'is-active' : ''}`}
                    onClick={() => setActive(active === b.id ? null : b.id)}
                  >
                    <div className="bs-card__top">
                      <span className={`pill ${gradePill(grade)} bs-card__grade`}>
                        {meta.label}
                      </span>
                      <span className="bs-card__age">건축 {age}년</span>
                    </div>
                    <h3 className="bs-card__name">{b.name}</h3>
                    <p className="bs-card__sub">
                      {b.built} · {b.structure} · {b.floors}F · {b.area.toLocaleString()}㎡
                    </p>
                    <div className="bs-card__tags">
                      {b.certified ? (
                        <span className="bs-tag bs-tag--good">✓ 안전인증 {b.certified}</span>
                      ) : (
                        <span className="bs-tag bs-tag--warn">인증 미적용</span>
                      )}
                      {b.seismicScheduled && (
                        <span className="bs-tag bs-tag--info">내진평가 {b.seismicScheduled}</span>
                      )}
                      {b.usedBy.length > 0 && (
                        <span className="bs-tag bs-tag--dept">
                          {b.usedBy.map((id) => getDepartment(id)?.shortName).filter(Boolean).join('·')}
                        </span>
                      )}
                    </div>
                    {b.note && <p className="bs-card__note">※ {b.note}</p>}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="bs-empty">조건에 맞는 건물이 없습니다.</p>
              )}
            </div>
          </section>

          {/* Step 3 — 디테일 */}
          {activeBuilding && (
            <section className="bs-detail">
              <div className="bs-section__head">
                <span className="eyebrow">Step 3 · Detail</span>
                <h2>
                  <span className="bs-detail__icon">🏛️</span> {activeBuilding.name}
                </h2>
                <p>이 건물에서 사고 발생 시 행동 가이드</p>
              </div>
              <BuildingDetail b={activeBuilding} />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function gradePill(grade) {
  switch (grade) {
    case 'A': return 'pill-green';
    case 'B': return 'pill-blue';
    case 'C': return 'pill-orange';
    case 'D': return 'pill-red';
    default: return 'pill-gray';
  }
}

function BuildingDetail({ b }) {
  const grade = getSafetyGrade(b);
  const meta = GRADE_META[grade];
  const age = 2026 - b.built;
  const depts = b.usedBy.map((id) => getDepartment(id)).filter(Boolean);

  return (
    <div className="bs-detail__grid">
      <article className="glass-card bs-detail__main">
        <h3 className="card-title">기본 정보</h3>
        <dl className="bs-detail__dl">
          <div><dt>준공</dt><dd>{b.built}년 ({age}년 경과)</dd></div>
          <div><dt>구조</dt><dd>{b.structure}</dd></div>
          <div><dt>층수</dt><dd>{b.floors}층</dd></div>
          <div><dt>연면적</dt><dd>{b.area.toLocaleString()}㎡</dd></div>
          <div>
            <dt>안전등급</dt>
            <dd><span className={`pill ${gradePill(grade)}`}>{meta.label}</span> — {meta.desc}</dd>
          </div>
          <div>
            <dt>안전인증</dt>
            <dd>{b.certified ? `${b.certified}년 완료` : '미적용 (PDF 표 기준)'}</dd>
          </div>
          <div>
            <dt>내진평가</dt>
            <dd>{b.seismicScheduled ? `${b.seismicScheduled}년 예정` : '계획 없음'}</dd>
          </div>
          {depts.length > 0 && (
            <div>
              <dt>주 사용 학과</dt>
              <dd>{depts.map((d) => `${d.icon} ${d.name}`).join(' · ')}</dd>
            </div>
          )}
        </dl>
      </article>

      <article className="glass-card bs-detail__advice">
        <h3 className="card-title">사고 발생 시</h3>
        <ol className="bs-detail__steps">
          <li>
            <strong>1. 즉시 안전 확보</strong>
            <p>위험원 차단 + 환자를 안전한 곳으로 이동</p>
          </li>
          <li>
            <strong>2. 119 호출 → {NEAREST_HOSPITAL.name}</strong>
            <p>
              <a href={`tel:${NEAREST_HOSPITAL.phone.replace(/-/g, '')}`}>{NEAREST_HOSPITAL.phone}</a> · {NEAREST_HOSPITAL.desc}
            </p>
          </li>
          <li>
            <strong>3. 학교 통합상황실 통지</strong>
            <p><a href="tel:0328702424">032-870-2424</a> (PDF p.80) · 사고 단계별 학교장 보고는 사고등급 매트릭스 참조</p>
          </li>
          {!b.certified && (
            <li className="bs-detail__warn">
              <strong>⚠ 안전인증 미적용 건물</strong>
              <p>이 건물은 「교육시설법」 인증을 아직 받지 않은 동입니다. 사고 발생 시 시설 결함 가능성을 우선 검토해주세요. 시설안전팀 곽세일 팀장 <a href="tel:0328702410">032-870-2410</a></p>
            </li>
          )}
          {age >= 40 && (
            <li className="bs-detail__warn">
              <strong>⚠ 노후 시설 ({age}년 경과)</strong>
              <p>전기·배관·구조에 노후 위험요소가 있을 수 있습니다. 정기점검 결과 확인 후 사용을 권장합니다.</p>
            </li>
          )}
        </ol>
      </article>
    </div>
  );
}

// 학과별 자주 사용 건물 빠른 가이드 (외부에서 import 가능)
export function quickBuildingsForDept(deptId) {
  return getBuildingsByDept(deptId);
}

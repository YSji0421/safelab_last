import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEPARTMENT_LIST } from '../data/departments';
import './DepartmentSelectPage.css';

export default function DepartmentSelectPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [studentNo, setStudentNo] = useState('');
  const [selected, setSelected] = useState(null);

  const proceed = () => {
    if (!selected) return;
    const profile = {
      name: name.trim() || '학생',
      studentNo: studentNo.trim() || `temp-${Date.now()}`,
      deptId: selected,
      enrolledAt: new Date().toISOString(),
    };
    localStorage.setItem('safelab.student', JSON.stringify(profile));
    navigate(`/student/safety/${selected}`);
  };

  const selectedDept = DEPARTMENT_LIST.find((d) => d.id === selected);

  return (
    <div className="app-shell">
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />
      <div className="ds-frame">
        <header className="ds-header">
          <button className="ds-back" onClick={() => navigate('/')} aria-label="뒤로">
            ←
          </button>
          <div className="ds-header__title">
            <h1>학과 선택</h1>
            <p>본인 학과를 선택하면 맞춤 안전교육이 시작됩니다</p>
          </div>
          <div className="ds-header__right" />
        </header>

        <main className="ds-main">
          <section className="ds-section">
            <div className="ds-section__head">
              <span className="eyebrow">Step 1</span>
              <h2>학생 정보</h2>
              <p>비밀번호 없이 이름·학번만으로 진행합니다 (시연 단순화)</p>
            </div>
            <div className="ds-id-card">
              <div className="ds-field">
                <label htmlFor="ds-name">이름</label>
                <input
                  id="ds-name"
                  className="t-input"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div className="ds-field">
                <label htmlFor="ds-no">학번</label>
                <input
                  id="ds-no"
                  className="t-input"
                  placeholder="20245010"
                  value={studentNo}
                  onChange={(e) => setStudentNo(e.target.value)}
                  inputMode="numeric"
                />
              </div>
            </div>
          </section>

          <section className="ds-section">
            <div className="ds-section__head">
              <span className="eyebrow">Step 2</span>
              <h2>학과 선택</h2>
              <p>학과별 위험요소·시나리오·약관 매핑이 자동 적용됩니다</p>
            </div>
            <div className="ds-grid">
              {DEPARTMENT_LIST.map((d) => {
                const on = selected === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    className={`ds-card ${on ? 'is-selected' : ''}`}
                    onClick={() => setSelected(d.id)}
                    aria-pressed={on}
                  >
                    <div className="ds-card__top">
                      <span
                        className="ds-card__icon"
                        style={{ background: `${d.accent}1a`, color: d.accent }}
                      >
                        {d.icon}
                      </span>
                      <span
                        className={`ds-card__radio ${on ? 'on' : ''}`}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="ds-card__name">{d.name}</h3>
                    <p className="ds-card__desc">{d.desc}</p>
                    <ul className="ds-card__tags">
                      {d.riskTags.map((t) => (
                        <li key={t} className="pill pill-rose">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </section>
        </main>

        <footer className="ds-cta-bar">
          <div className="ds-cta-bar__inner">
            <div className="ds-cta-bar__summary">
              {selectedDept ? (
                <>
                  <span className="ds-cta-bar__label">선택된 학과</span>
                  <span className="ds-cta-bar__value">
                    {selectedDept.icon} {selectedDept.name}
                  </span>
                </>
              ) : (
                <span className="ds-cta-bar__hint">학과를 선택하면 시작 버튼이 활성화됩니다</span>
              )}
            </div>
            <button
              type="button"
              className="t-btn t-btn-primary"
              disabled={!selected}
              onClick={proceed}
            >
              {selected ? '안전교육 시작 →' : '학과 선택 필요'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

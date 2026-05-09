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

  return (
    <div className="app-shell">
      <div className="mobile-frame ds-frame">
        <div className="ds-header">
          <button className="ds-back" onClick={() => navigate('/')} aria-label="뒤로">←</button>
          <h1>학과 선택</h1>
          <p>본인 학과를 선택하면 맞춤 안전교육이 시작됩니다</p>
        </div>

        <div className="ds-id-card">
          <div className="ds-id-row">
            <label>이름</label>
            <input
              className="t-input"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="ds-id-row">
            <label>학번</label>
            <input
              className="t-input"
              placeholder="20245010"
              value={studentNo}
              onChange={(e) => setStudentNo(e.target.value)}
            />
          </div>
          <small>※ 비밀번호 없이 학번만으로 진행합니다 (시연 단순화).</small>
        </div>

        <div className="section-title">학과</div>
        <div className="ds-list">
          {DEPARTMENT_LIST.map((d) => (
            <button
              key={d.id}
              className={`ds-card ${selected === d.id ? 'on' : ''}`}
              onClick={() => setSelected(d.id)}
            >
              <div className="ds-card-icon">{d.icon}</div>
              <div className="ds-card-body">
                <div className="ds-card-title">{d.name}</div>
                <div className="ds-card-desc">{d.desc}</div>
                <div className="ds-card-tags">
                  {d.riskTags.map((t) => (
                    <span key={t} className="pill pill-red">{t}</span>
                  ))}
                </div>
              </div>
              <div className="ds-card-radio">{selected === d.id ? '●' : '○'}</div>
            </button>
          ))}
        </div>

        <div className="ds-cta">
          <button
            className="t-btn t-btn-primary t-btn-block"
            disabled={!selected}
            onClick={proceed}
          >
            {selected ? '안전교육 시작 →' : '학과를 먼저 선택해주세요'}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMMON_EMERGENCY } from '../data/emergencyCommon';
import { getDepartment } from '../data/departments';
import './EmergencyPage.css';

export default function EmergencyPage() {
  const navigate = useNavigate();

  const studentDept = useMemo(() => {
    try {
      const raw = localStorage.getItem('safelab.student');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.deptId ? getDepartment(parsed.deptId) : null;
    } catch {
      return null;
    }
  }, []);

  const handleCall = (phone) => {
    window.location.href = `tel:${phone.replace(/-/g, '')}`;
  };

  return (
    <div className="app-shell">
      <div className="mobile-frame em-frame">
        <div className="em-header">
          <button className="em-back" onClick={() => navigate(-1)} aria-label="뒤로">←</button>
          <h1>긴급 연락처</h1>
          <p>지금 사고 발생 시 — 위에서부터 순서대로 연락하세요</p>
        </div>

        <div className="em-warn">
          <span>⚠️</span>
          <div>
            <strong>먼저 119 — 그 다음 학과·안전원 통지</strong>
            <small>약관 제11조: 사고 인지 즉시 안전원에 통지해야 보상 가능</small>
          </div>
        </div>

        {studentDept && (
          <section className="em-section">
            <div className="em-section-title">
              <span className="em-dept-badge">{studentDept.icon} {studentDept.name}</span>
              <span className="em-section-sub">학과 전용</span>
            </div>
            <div className="em-list">
              {studentDept.emergencyContacts.map((c, i) => (
                <button key={i} className="em-item dept" onClick={() => handleCall(c.phone)}>
                  <div className="em-item-main">
                    <strong>{c.label}</strong>
                    <small>{c.desc}</small>
                  </div>
                  <div className="em-item-call">
                    <span className="em-phone">{c.phone}</span>
                    <span className="em-call-btn">📞</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {COMMON_EMERGENCY.map((group, gi) => (
          <section className="em-section" key={gi}>
            <div className="em-section-title">
              <span>{group.category}</span>
            </div>
            <div className="em-list">
              {group.items.map((c, i) => (
                <button
                  key={i}
                  className={`em-item ${c.urgent ? 'urgent' : ''}`}
                  onClick={() => handleCall(c.phone)}
                >
                  <div className="em-item-main">
                    <strong>{c.label}</strong>
                    <small>{c.desc}</small>
                  </div>
                  <div className="em-item-call">
                    <span className="em-phone">{c.phone}</span>
                    <span className="em-call-btn">📞</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}

        <div className="em-footer-note">
          긴급상황 후에는 안전관리실에 사고 경위서를 제출해주세요.<br />
          연구실안전공제 청구는 사고 인지 후 3년 이내(약관 제26조).
        </div>
      </div>
    </div>
  );
}

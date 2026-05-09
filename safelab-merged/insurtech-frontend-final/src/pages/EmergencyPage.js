import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMMON_EMERGENCY } from '../data/emergencyCommon';
import { getDepartment } from '../data/departments';
import { SEVERITY_LEVELS, REPORTING_CHAINS } from '../data/incidentTypes';
import './EmergencyPage.css';

const SEVERITY_ORDER = ['심각', '경계', '주의', '관심'];

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
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />
      <div className="em-frame">
        <header className="em-header">
          <button className="em-back" onClick={() => navigate(-1)} aria-label="뒤로">
            ←
          </button>
          <div className="em-header__title">
            <h1>긴급 연락처</h1>
            <p>사고 발생 시 — 위에서부터 순서대로 연락하세요</p>
          </div>
          <button
            type="button"
            className="em-header__photo"
            onClick={() => navigate('/incident/photo')}
            title="사진으로 사고 신고"
            aria-label="사진으로 사고 신고"
          >
            📷
          </button>
        </header>

        <main className="em-main">
          {/* 경고 배너 */}
          <div className="em-warn">
            <div className="em-warn__icon">⚠️</div>
            <div className="em-warn__body">
              <strong>먼저 119 — 그 다음 학과·안전원 통지</strong>
              <span>약관 제11조: 사고 인지 즉시 안전원에 통지해야 보상 가능</span>
            </div>
            <div
              className="em-warn__cta"
              onClick={() => handleCall('119')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCall('119')}
            >
              <span className="em-warn__num">119</span>
              <span className="em-warn__label">즉시 호출</span>
            </div>
          </div>

          {/* 사고 등급별 신고 가이드 (B 패키지) */}
          <section className="em-section">
            <div className="em-section__head">
              <span className="eyebrow">사고 등급별 신고 가이드</span>
              <h2>등급에 따라 신고처가 다릅니다</h2>
              <p>출처: 인하공전 「2026 대학안전관리계획」 p.24~25 사고등급 평가 매트릭스</p>
            </div>
            <div className="em-severity-grid">
              {SEVERITY_ORDER.map((sev) => {
                const meta = SEVERITY_LEVELS[sev];
                const chain = REPORTING_CHAINS[sev] || [];
                return (
                  <details key={sev} className={`em-severity em-severity--${meta.color}`}>
                    <summary className="em-severity__summary">
                      <span className={`pill ${meta.pillClass} em-severity__pill`}>
                        {meta.label}
                      </span>
                      <span className="em-severity__desc">{meta.description}</span>
                      <span className="em-severity__deadline">{meta.deadline}</span>
                      <span className="em-severity__chev" aria-hidden>▾</span>
                    </summary>
                    <ol className="em-severity__chain">
                      {chain.map((r) => (
                        <li key={r.step} className="em-severity__step">
                          <span className="em-severity__num">{String(r.step).padStart(2, '0')}</span>
                          <div>
                            <h4>{r.label}</h4>
                            {r.phone && (
                              <button
                                type="button"
                                className="em-severity__call"
                                onClick={() =>
                                  r.kind === 'email'
                                    ? (window.location.href = `mailto:${r.phone}`)
                                    : handleCall(r.phone)
                                }
                              >
                                {r.kind === 'email' ? '✉ ' : '📞 '}
                                {r.phone}
                              </button>
                            )}
                            {r.desc && <p>{r.desc}</p>}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </details>
                );
              })}
            </div>
          </section>

          {/* 학과 전용 (있을 때만) */}
          {studentDept && (
            <section className="em-section">
              <div className="em-section__head">
                <span className="eyebrow">학과 전용</span>
                <h2>
                  <span className="em-dept-icon" aria-hidden>
                    {studentDept.icon}
                  </span>
                  {studentDept.name}
                </h2>
                <p>학생 정보로 매핑된 학과의 1차 연락처</p>
              </div>
              <div className="em-grid">
                {studentDept.emergencyContacts.map((c, i) => (
                  <ContactCard
                    key={i}
                    item={c}
                    onCall={handleCall}
                    variant="dept"
                  />
                ))}
              </div>
            </section>
          )}

          {/* 공통 카테고리들 */}
          {COMMON_EMERGENCY.map((group, gi) => (
            <section className="em-section" key={gi}>
              <div className="em-section__head">
                <span className="eyebrow">{group.category}</span>
                <h2>{group.heading || group.category}</h2>
                {group.subtitle && <p>{group.subtitle}</p>}
              </div>
              <div className="em-grid">
                {group.items.map((c, i) => (
                  <ContactCard
                    key={i}
                    item={c}
                    onCall={handleCall}
                    variant={c.urgent ? 'urgent' : 'normal'}
                  />
                ))}
              </div>
            </section>
          ))}

          {/* 비상조치 가이드 (SE-4) — CPR / AED / 소화기 */}
          <section className="em-section">
            <div className="em-section__head">
              <span className="eyebrow">비상조치 — 골든타임 5분</span>
              <h2>119가 도착할 때까지 당신이 할 수 있는 것</h2>
              <p>출처: 인하공전 「2026 안전교육자료」 p.46~48 — CPR + AED + 소화기 사용법</p>
            </div>
            <div className="em-action-grid">
              <article className="em-action em-action--red">
                <div className="em-action__head">
                  <span className="em-action__icon">🫀</span>
                  <h3>심폐소생술 (CPR)</h3>
                </div>
                <ol className="em-action__steps">
                  <li><strong>심정지 확인</strong> — 어깨 두드림 + 반응·호흡 확인</li>
                  <li><strong>119 신고</strong> — 도움 요청 + 주변 사람 지명</li>
                  <li><strong>흉부압박 30회</strong> — 가슴 중앙 양손 깍지 + 체중 실어 강하게</li>
                  <li><strong>인공호흡 2회</strong> — 기도 개방 후 시행</li>
                  <li><strong>반복</strong> — 119 도착까지 30:2 반복</li>
                </ol>
              </article>

              <article className="em-action em-action--blue">
                <div className="em-action__head">
                  <span className="em-action__icon">⚡</span>
                  <h3>자동제세동기 (AED)</h3>
                </div>
                <ol className="em-action__steps">
                  <li><strong>전원 ON</strong> — AED 케이스 열고 전원 버튼</li>
                  <li><strong>패드 부착</strong> — 우측 쇄골 아래 + 좌측 옆구리 (그림 참조)</li>
                  <li><strong>제세동 실시</strong> — "물러나세요" 외친 후 버튼 (접촉 금지)</li>
                  <li><strong>즉시 CPR 재개</strong> — 30:2 반복 / 2분마다 AED 분석</li>
                </ol>
                <p className="em-action__note">
                  💡 인하공전 캠퍼스 AED 위치: 본관·1호관·11호관·생활관 (PDF p.30 참조)
                </p>
              </article>

              <article className="em-action em-action--orange">
                <div className="em-action__head">
                  <span className="em-action__icon">🧯</span>
                  <h3>소화기 사용법 (PASS)</h3>
                </div>
                <ol className="em-action__steps">
                  <li><strong>P</strong>ull — 안전핀 뽑기 (손잡이 사이 핀)</li>
                  <li><strong>A</strong>im — 노즐을 불 밑부분 향하기</li>
                  <li><strong>S</strong>queeze — 손잡이를 꽉 누르기</li>
                  <li><strong>S</strong>weep — 좌우로 빗자루질하듯 분사</li>
                </ol>
                <p className="em-action__note">
                  ⚠ 초기 5초 안에만 효과. 그 이상은 즉시 대피 + 119. 리튬·알칼리 금속은 물 사용 금지.
                </p>
              </article>
            </div>
          </section>

          <p className="em-footer-note">
            긴급상황 후에는 안전관리실에 <strong>사고 경위서</strong>를 제출해주세요.
            연구실안전공제 청구는 사고 인지 후 <strong>3년 이내</strong> (약관 제26조).
          </p>
        </main>
      </div>
    </div>
  );
}

function ContactCard({ item, onCall, variant = 'normal' }) {
  return (
    <button
      type="button"
      className={`em-card em-card--${variant}`}
      onClick={() => onCall(item.phone)}
    >
      <div className="em-card__head">
        <h3 className="em-card__name">{item.label}</h3>
        <span className="em-card__phone">{item.phone}</span>
      </div>
      <p className="em-card__desc">{item.desc}</p>
      <div className="em-card__cta">
        <span className="em-card__icon" aria-hidden>📞</span>
        전화 걸기
      </div>
    </button>
  );
}

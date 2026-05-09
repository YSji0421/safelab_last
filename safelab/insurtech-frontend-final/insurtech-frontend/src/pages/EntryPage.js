import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EntryPage.css';

const ShieldIcon = ({ size = 38, color = '#FFFFFF', stroke = 2.2 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color}
       strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.5 4 5.5v6.2c0 5 3.5 8.6 8 9.8 4.5-1.2 8-4.8 8-9.8V5.5l-8-3z" />
    <path d="m9 12 2 2 4-4.2" />
  </svg>
);

const PhoneMockup = () => (
  <div className="phone-mockup">
    <div className="phone-notch" />
    <div className="phone-screen">
      <div className="mock-statusbar">
        <span>9:41</span>
        <span>●●●●● ▮</span>
      </div>
      <div className="mock-header">
        <div className="mock-logo"><ShieldIcon size={18} color="#FFFFFF" stroke={2.4} /></div>
        <div className="mock-title">
          <div>화공환경과 안전교육</div>
          <small>이수율 1 / 2</small>
        </div>
      </div>
      <div className="mock-progress">
        <div className="mock-progress-fill" style={{ width: '50%' }} />
      </div>
      <div className="mock-card mock-card-done">
        <div className="mock-card-row">
          <span className="mock-pill mock-pill-done">✓ 완료</span>
          <span className="mock-card-score">5 / 5</span>
        </div>
        <div className="mock-card-title">강산 피부 접촉 사고</div>
        <div className="mock-card-tags">
          <span className="mock-tag">#화상</span>
          <span className="mock-tag">#응급세척</span>
        </div>
      </div>
      <div className="mock-card mock-card-active">
        <div className="mock-card-row">
          <span className="mock-pill mock-pill-now">진행 중 · 난이도 상</span>
        </div>
        <div className="mock-card-title">유독가스 누출 — 후드 고장</div>
        <div className="mock-card-narration">"드래프트 챔버가 멈춘 채로 염소가스가 누출되기 시작합니다…"</div>
        <div className="mock-choices">
          <div className="mock-choice">A · 창문을 연다</div>
          <div className="mock-choice mock-choice-pick">B · 즉시 대피하며 동료를 부른다</div>
          <div className="mock-choice">C · 가스 차단 밸브를 닫는다</div>
        </div>
      </div>
      <div className="mock-fab">
        <span>🚨</span> 긴급
      </div>
    </div>
  </div>
);

export default function EntryPage() {
  const navigate = useNavigate();

  return (
    <div className="app-shell entry-shell">
      <div className="entry-bg-blob entry-bg-blob-1" aria-hidden="true" />
      <div className="entry-bg-blob entry-bg-blob-2" aria-hidden="true" />

      <header className="entry-topbar">
        <div className="entry-brand">
          <div className="entry-brand-logo"><ShieldIcon size={20} stroke={2.4} /></div>
          <strong>SafeLab</strong>
        </div>
        <button className="entry-topbar-btn" onClick={() => navigate('/emergency')}>
          🚨 긴급 연락처
        </button>
      </header>

      <section className="entry-hero">
        <div className="entry-hero-text">
          <span className="entry-tag">「연구실안전공제」 기반 · 한국교육시설안전원</span>
          <h1>
            실험실 안전을<br />
            <span className="entry-hero-accent">학과의 일상</span>으로.
          </h1>
          <p>
            매학기 PPT 자동재생으로 끝나던 안전교육을<br />
            AI 1인칭 시나리오 + 약관 기반 퀴즈로 바꿉니다.
          </p>

          <div className="entry-cta-row">
            <button className="entry-cta-primary" onClick={() => navigate('/student/department')}>
              <span>🎓</span>
              <div>
                <strong>학생으로 시작</strong>
                <small>학과 선택 → 시나리오 → 이수증</small>
              </div>
            </button>
            <button className="entry-cta-ghost" onClick={() => navigate('/admin/login')}>
              <span>🧑‍💼</span>
              <div>
                <strong>관리자</strong>
                <small>이수 현황 · 안전 대시보드</small>
              </div>
            </button>
          </div>

          <div className="entry-stats">
            <div>
              <strong>4</strong>
              <small>시연 학과</small>
            </div>
            <div className="entry-stats-divider" />
            <div>
              <strong>8</strong>
              <small>AI 시나리오</small>
            </div>
            <div className="entry-stats-divider" />
            <div>
              <strong>14</strong>
              <small>후유장해 등급</small>
            </div>
            <div className="entry-stats-divider" />
            <div>
              <strong>3년</strong>
              <small>청구 시효</small>
            </div>
          </div>
        </div>

        <div className="entry-hero-visual">
          <div className="entry-hero-glow" aria-hidden="true" />
          <PhoneMockup />
        </div>
      </section>

      <section className="entry-features">
        <h2 className="entry-section-title">왜 SafeLab인가</h2>
        <div className="entry-features-grid">
          <div className="entry-feature">
            <div className="entry-feature-icon" style={{ background: '#FFE5E5', color: '#E60000' }}>📜</div>
            <strong>법정 의무공제 위 부가가치</strong>
            <p>「연구실 안전환경 조성에 관한 법률」 제26조 약관과 1:1 매핑된 컨텐츠</p>
          </div>
          <div className="entry-feature">
            <div className="entry-feature-icon" style={{ background: '#FEF3C7', color: '#92400E' }}>🤖</div>
            <strong>AI 1인칭 시나리오</strong>
            <p>학과별 사고 케이스 4단계 시뮬레이션 — 보상/제외 사유 즉시 학습</p>
          </div>
          <div className="entry-feature">
            <div className="entry-feature-icon" style={{ background: '#DCFCE7', color: '#15803D' }}>📋</div>
            <strong>관리자 대시보드</strong>
            <p>학과별 이수율, 미이수자 명단, 사고 분포까지 한 화면에</p>
          </div>
          <div className="entry-feature">
            <div className="entry-feature-icon" style={{ background: '#DBEAFE', color: '#1D4ED8' }}>🚨</div>
            <strong>긴급 ≠ 보험</strong>
            <p>사고 순간엔 119·학과 안전관리자로 직결. 보험 청구는 그 다음.</p>
          </div>
        </div>
      </section>

      <section className="entry-how">
        <h2 className="entry-section-title">학생 흐름 5단계</h2>
        <div className="entry-how-grid">
          {[
            { n: '01', t: '진입', d: '관리자/학생 분기' },
            { n: '02', t: '학과 선택', d: '학과별 맞춤 컨텐츠' },
            { n: '03', t: 'AI 시나리오', d: '1인칭 4단계 체험' },
            { n: '04', t: '약관 퀴즈', d: '5문항 4↑ 이수' },
            { n: '05', t: '이수증', d: '인쇄 / PDF 발급' },
          ].map((s) => (
            <div key={s.n} className="entry-how-step">
              <span className="entry-how-num">{s.n}</span>
              <strong>{s.t}</strong>
              <small>{s.d}</small>
            </div>
          ))}
        </div>
      </section>

      <footer className="entry-footer-v2">
        한국교육시설안전원 「연구실안전공제」 약관 기반 · SafeLab
      </footer>
    </div>
  );
}

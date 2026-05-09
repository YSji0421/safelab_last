import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EntryPage.css';

/* ──────────────────────────────────────
   Inline icons (lucide-style stroke)
   ────────────────────────────────────── */
const Icon = ({ d, size = 20, stroke = 1.8, className }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
       strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {d}
  </svg>
);

const IconShield = (p) => <Icon {...p} d={<>
  <path d="M12 2.5 4 5.5v6.2c0 5 3.5 8.6 8 9.8 4.5-1.2 8-4.8 8-9.8V5.5l-8-3z" />
  <path d="m9 12 2 2 4-4.2" />
</>} />;

const IconArrow = (p) => <Icon {...p} d={<>
  <path d="M5 12h14" /><path d="m13 5 7 7-7 7" />
</>} />;

const IconSparkle = (p) => <Icon {...p} d={<>
  <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
</>} />;

const IconBolt = (p) => <Icon {...p} d={<path d="M13 2 4 14h8l-1 8 9-12h-8l1-8z" />} />;

const IconChart = (p) => <Icon {...p} d={<>
  <path d="M3 3v18h18" />
  <path d="M7 14l3-3 3 3 5-6" />
</>} />;

const IconBook = (p) => <Icon {...p} d={<>
  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z" />
  <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20" />
</>} />;

const IconAlert = (p) => <Icon {...p} d={<>
  <path d="M12 2 1 21h22L12 2z" />
  <path d="M12 9v5" /><path d="M12 18h.01" />
</>} />;

/* ──────────────────────────────────────
   Phone preview (mini live UI)
   ────────────────────────────────────── */
const PhonePreview = () => (
  <div className="bnt-phone">
    <div className="bnt-phone-notch" />
    <div className="bnt-phone-screen">
      <div className="bnt-phone-bar"><span>9:41</span><span>···</span></div>
      <div className="bnt-phone-head">
        <div className="bnt-phone-logo"><IconShield size={16} stroke={2.4} /></div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800 }}>화공환경과</div>
          <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>이수율 1 / 2</div>
        </div>
      </div>
      <div className="bnt-phone-progress"><span style={{ width: '50%' }} /></div>

      <div className="bnt-phone-card done">
        <div className="bnt-phone-card-row">
          <span className="bnt-phone-pill done">✓ 완료 5/5</span>
        </div>
        <div className="bnt-phone-card-title">강산 피부 접촉</div>
        <div className="bnt-phone-tags">
          <span>#화상</span><span>#응급</span>
        </div>
      </div>

      <div className="bnt-phone-card active">
        <div className="bnt-phone-card-row">
          <span className="bnt-phone-pill now">진행중 · 난이도 상</span>
        </div>
        <div className="bnt-phone-card-title">유독가스 누출</div>
        <div className="bnt-phone-quote">"드래프트 챔버가 멈춘 채로 염소가스가 누출되기 시작합니다…"</div>
        <div className="bnt-phone-choices">
          <div>A · 창문을 연다</div>
          <div className="pick">B · 즉시 대피하며 동료를 부른다</div>
          <div>C · 가스 차단 밸브를 닫는다</div>
        </div>
      </div>

      <div className="bnt-phone-fab">긴급</div>
    </div>
  </div>
);

/* ──────────────────────────────────────
   Mini admin dashboard preview
   ────────────────────────────────────── */
const AdminPreview = () => (
  <div className="bnt-admin">
    <div className="bnt-admin-bar">
      <div className="bnt-admin-dot d-r" />
      <div className="bnt-admin-dot d-y" />
      <div className="bnt-admin-dot d-g" />
      <span>SafeLab Admin</span>
    </div>
    <div className="bnt-admin-body">
      <div className="bnt-admin-kpi-row">
        <div className="bnt-admin-kpi"><small>이수율</small><strong>68%</strong></div>
        <div className="bnt-admin-kpi"><small>미이수</small><strong>121</strong></div>
        <div className="bnt-admin-kpi"><small>사고 7일</small><strong>3</strong></div>
      </div>
      <div className="bnt-admin-bars">
        {[{n:'화공환경과', v: 76}, {n:'기계과', v: 60}, {n:'전기정보과', v: 73}, {n:'컴퓨터정보과', v: 65}].map((d) => (
          <div className="bnt-admin-bar" key={d.n}>
            <div className="bnt-admin-bar-row">
              <span>{d.n}</span><strong>{d.v}%</strong>
            </div>
            <div className="bnt-admin-bar-track"><span style={{width: `${d.v}%`}} /></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ──────────────────────────────────────
   Page
   ────────────────────────────────────── */
export default function EntryPage() {
  const navigate = useNavigate();

  return (
    <div className="app-shell entry-v3">
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />

      {/* Topbar */}
      <header className="v3-nav">
        <div className="v3-brand">
          <div className="v3-brand-mark"><IconShield size={18} stroke={2.4} /></div>
          <strong>SafeLab</strong>
          <span className="v3-brand-sub">/ 인슈어테크</span>
        </div>
        <nav className="v3-nav-links">
          <a href="#why">왜 SafeLab</a>
          <a href="#how">학생 흐름</a>
          <a href="#stack">기술</a>
        </nav>
        <div className="v3-nav-cta">
          <button className="v3-btn-text" onClick={() => navigate('/emergency')}>
            긴급 연락처 <IconArrow size={14} stroke={2} />
          </button>
          <button className="v3-btn-dark" onClick={() => navigate('/student/department')}>
            시작하기 <IconArrow size={14} stroke={2.2} />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="v3-hero">
        <div className="v3-hero-inner">
          <span className="v3-pill">
            <IconSparkle size={12} stroke={2.4} />
            「연구실안전공제」 약관 기반 · 한국교육시설안전원
          </span>

          <h1 className="v3-h1">
            실험실 안전을<br />
            <em className="v3-h1-em">학과의 일상</em>으로.
          </h1>

          <p className="v3-lede">
            매학기 PPT 자동재생으로 끝나던 안전교육을<br />
            <strong>AI 1인칭 시나리오 + 약관 기반 퀴즈</strong>로 다시 설계했습니다.
          </p>

          <div className="v3-cta-row">
            <button className="v3-cta-primary" onClick={() => navigate('/student/department')}>
              <span>학생으로 시작하기</span>
              <IconArrow size={16} stroke={2.2} />
            </button>
            <button className="v3-cta-ghost" onClick={() => navigate('/admin/login')}>
              <span>관리자 로그인</span>
            </button>
          </div>

          <div className="v3-trust">
            <span>지원 학과</span>
            <div className="v3-trust-list">
              <span>화공환경과</span>
              <span>기계과</span>
              <span>전기정보과</span>
              <span>컴퓨터정보과</span>
            </div>
          </div>
        </div>

        {/* Hero visual: phone + 떠있는 작은 카드들 */}
        <div className="v3-hero-visual">
          <div className="v3-aura" />
          <div className="v3-mini-card v3-mini-1">
            <div className="v3-mini-icon"><IconSparkle size={16} stroke={2.4} /></div>
            <strong>AI 시나리오</strong>
            <small>1인칭 4단계</small>
          </div>
          <div className="v3-mini-card v3-mini-2">
            <div className="v3-mini-row">
              <strong>이수증</strong>
              <span className="v3-mini-tick">✓</span>
            </div>
            <small>IHC-CHEM-2026</small>
          </div>
          <div className="v3-mini-card v3-mini-3">
            <div className="v3-mini-bar">
              <span style={{ width: '76%' }} />
            </div>
            <small>화공환경과 76% 이수</small>
          </div>
          <PhonePreview />
        </div>
      </section>

      {/* Marquee — 약관 키워드 흐름 */}
      <div className="v3-marquee" aria-hidden="true">
        <div className="v3-marquee-track">
          {[...Array(2)].flatMap((_, k) => [
            '제3조 보상하는 손해',
            '제10조 제외사유',
            '제11조 통지의무',
            '별표1 후유장해 14등급',
            '단체계약 특약',
            '화상 간접지원금',
            '등록금 손실 지원',
            '간병비용 특약',
          ].map((t, i) => (
            <span key={`${k}-${i}`}>{t}</span>
          )))}
        </div>
      </div>

      {/* Bento grid — Why */}
      <section id="why" className="v3-section">
        <div className="v3-section-head">
          <span className="v3-eyebrow">Why SafeLab</span>
          <h2 className="v3-h2">한 페이지로 보는 차별점.</h2>
          <p className="v3-h2-sub">
            법정 의무공제 위에 얹는 부가가치 레이어. 약관과 1:1 매핑된 컨텐츠.
          </p>
        </div>

        <div className="v3-bento">
          {/* 큰 메인 카드 — Live admin preview */}
          <article className="v3-bento-card v3-bento-lg">
            <div className="v3-bento-meta">
              <span className="v3-bento-tag">관리자</span>
              <h3>학과별 이수 현황을<br />한 화면에.</h3>
              <p>KPI · 학과별 이수율 · 미이수자 명단 · 사고 분포까지. mock fallback이 있어 백엔드 없이도 시연 가능.</p>
            </div>
            <div className="v3-bento-visual">
              <AdminPreview />
            </div>
          </article>

          {/* 4 medium cards */}
          <article className="v3-bento-card">
            <div className="v3-bento-icon"><IconBook size={20} stroke={2} /></div>
            <h3>법정 의무공제 위 부가가치</h3>
            <p>「연구실 안전환경 조성에 관한 법률」 제26조 — 한국교육시설안전원 약관과 1:1 매핑된 안전교육.</p>
          </article>

          <article className="v3-bento-card">
            <div className="v3-bento-icon"><IconBolt size={20} stroke={2} /></div>
            <h3>AI 1인칭 시나리오</h3>
            <p>학과별 사고 케이스를 4단계로 체험 — 보상되는 손해와 제외 사유를 즉시 학습.</p>
          </article>

          <article className="v3-bento-card">
            <div className="v3-bento-icon"><IconChart size={20} stroke={2} /></div>
            <h3>약관 기반 퀴즈 5문항</h3>
            <p>제3조 / 제10조 / 별표1 후유장해 14등급에서 자동 출제. 4문항 이상이면 이수.</p>
          </article>

          <article className="v3-bento-card v3-bento-dark">
            <div className="v3-bento-icon"><IconAlert size={20} stroke={2} /></div>
            <h3>긴급 ≠ 보험.</h3>
            <p>사고 순간엔 119·학과 안전관리자로 직결. 보험 청구 화면으로 직결되는 잘못된 동선을 끊었습니다.</p>
          </article>
        </div>
      </section>

      {/* Numbers strip */}
      <section className="v3-numbers">
        {[
          { n: '4', l: '시연 학과' },
          { n: '8', l: 'AI 시나리오' },
          { n: '14', l: '후유장해 등급' },
          { n: '3년', l: '청구 시효' },
        ].map((s) => (
          <div className="v3-num" key={s.l}>
            <strong>{s.n}</strong>
            <small>{s.l}</small>
          </div>
        ))}
      </section>

      {/* How — Timeline */}
      <section id="how" className="v3-section">
        <div className="v3-section-head">
          <span className="v3-eyebrow">학생 흐름</span>
          <h2 className="v3-h2">진입 → 시나리오 → 이수증.<br /><em>5단계로 끝납니다.</em></h2>
        </div>
        <div className="v3-timeline">
          {[
            { n: '01', t: '진입', d: '관리자/학생 분기' },
            { n: '02', t: '학과 선택', d: '맞춤 컨텐츠 매칭' },
            { n: '03', t: 'AI 시나리오', d: '1인칭 4단계' },
            { n: '04', t: '약관 퀴즈', d: '5문항 4↑ 이수' },
            { n: '05', t: '이수증', d: '인쇄 / PDF' },
          ].map((s, i, arr) => (
            <React.Fragment key={s.n}>
              <div className="v3-timeline-step">
                <span className="v3-timeline-num">{s.n}</span>
                <strong>{s.t}</strong>
                <small>{s.d}</small>
              </div>
              {i < arr.length - 1 && <div className="v3-timeline-line" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="v3-cta-section">
        <div className="v3-cta-card">
          <span className="v3-eyebrow light">Ready to deploy</span>
          <h2 className="v3-h2 light">학과 단위로 시작해<br />단체공제까지 자연스럽게.</h2>
          <p className="v3-h2-sub light">
            인하공전 인슈어테크 팀의 2026 경진대회 출품작. 1주 데모, 4학과, 8 시나리오로 시연 가능합니다.
          </p>
          <div className="v3-cta-row">
            <button className="v3-cta-light" onClick={() => navigate('/student/department')}>
              <span>학생으로 시작</span>
              <IconArrow size={16} stroke={2.2} />
            </button>
            <button className="v3-cta-outline" onClick={() => navigate('/admin/login')}>
              <span>관리자 로그인</span>
            </button>
          </div>
        </div>
      </section>

      <footer className="v3-foot">
        <span>SafeLab</span>
        <span>한국교육시설안전원 「연구실안전공제」 약관 기반</span>
      </footer>
    </div>
  );
}

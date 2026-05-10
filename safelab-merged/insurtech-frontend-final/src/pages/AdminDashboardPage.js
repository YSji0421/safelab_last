import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ADMIN_KPI,
  DEPT_PROGRESS,
  ACCIDENT_TYPE_COLOR,
  ACCIDENT_DISTRIBUTION_FALLBACK,
  RECENT_INCIDENTS_FALLBACK,
  PENDING_STUDENTS_FALLBACK,
} from '../data/adminMockStats';
import { safetyApi } from '../services/api';
import './AdminDashboardPage.css';

// 관리자 빠른 접근 메뉴 — 새로 추가된 모든 기능 진입점
const QUICK_LINKS = [
  { icon: '🏫', label: '학교 전체 통합 뷰',   desc: '4학과 합산 자동 집계 + CSV/JSON 내보내기',  to: '/admin/dept/all',     tone: 'primary' },
  { icon: '📚', label: '사고사례 라이브러리', desc: '「2026 안전교육자료」 PDF 사고 10건',         to: '/safety/cases',       tone: 'default' },
  { icon: '🧪', label: 'MSDS 학습',            desc: '16항목 + GHS 그림문자 9종 + 시약 5종',       to: '/safety/msds',        tone: 'default' },
  { icon: '🏛️', label: '캠퍼스 건물 안전등급', desc: '인하공전 25개 동 인증/내진평가',             to: '/buildings',          tone: 'default' },
  { icon: '🛡️', label: '연구실안전공제 가입', desc: '제26조 의무 가입 신청 시연',                  to: '/insurance/enroll',   tone: 'mint' },
  { icon: '📋', label: '보상 청구 시연',      desc: '사고 → 청구 의사 접수 폼',                    to: '/insurance/claim',    tone: 'mint' },
  { icon: '📷', label: '사진 사고 신고',      desc: 'AI 사고등급 4단계 자동 분류',                 to: '/incident/photo',     tone: 'warn' },
  { icon: '🚨', label: '비상 가이드',         desc: '신고 체인 + CPR/AED/소화기 PASS',            to: '/emergency',          tone: 'warn' },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [showPending, setShowPending] = useState(false);
  const [serverData, setServerData] = useState(null);
  const [serverStatus, setServerStatus] = useState('idle'); // idle | live | offline
  const [accidents, setAccidents] = useState(ACCIDENT_DISTRIBUTION_FALLBACK);
  const [incidents, setIncidents] = useState(RECENT_INCIDENTS_FALLBACK);
  const [pending, setPending] = useState(PENDING_STUDENTS_FALLBACK);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('safelab.admin');
      if (!raw) {
        navigate('/admin/login');
        return;
      }
      setAdmin(JSON.parse(raw));
    } catch {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    let alive = true;
    safetyApi.getAdminProgress()
      .then((res) => {
        if (!alive) return;
        const data = res.data;
        const looksValid = data
          && typeof data === 'object'
          && typeof data.completionRate === 'number';
        if (!looksValid) {
          setServerStatus('offline');
          return;
        }
        setServerData(data);
        setServerStatus('live');
      })
      .catch(() => {
        if (!alive) return;
        setServerStatus('offline');
      });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    safetyApi.getAccidentDistribution()
      .then((res) => { if (alive && Array.isArray(res.data)) setAccidents(res.data); })
      .catch(() => { /* keep fallback */ });
    safetyApi.getRecentIncidents()
      .then((res) => { if (alive && Array.isArray(res.data)) setIncidents(res.data); })
      .catch(() => { /* keep fallback */ });
    safetyApi.getPendingStudents()
      .then((res) => { if (alive && Array.isArray(res.data)) setPending(res.data); })
      .catch(() => { /* keep fallback */ });
    return () => { alive = false; };
  }, []);

  const logout = () => {
    localStorage.removeItem('safelab.admin');
    navigate('/');
  };

  // 서버 데이터가 있으면 KPI/학과별 진척은 서버 우선, 사고분포/최근사고/미이수자는 별도 API.
  const kpi = serverData ? {
    totalStudents:      serverData.totalStudents      ?? ADMIN_KPI.totalStudents,
    enrolledStudents:   serverData.enrolledStudents   ?? ADMIN_KPI.enrolledStudents,
    completionRate:     serverData.completionRate     ?? ADMIN_KPI.completionRate,
    pendingStudents:    serverData.pendingStudents    ?? ADMIN_KPI.pendingStudents,
    recentIncidents7d:  serverData.recentIncidents7d  ?? ADMIN_KPI.recentIncidents7d,
    scenariosCompleted: serverData.scenariosCompleted ?? ADMIN_KPI.scenariosCompleted,
  } : ADMIN_KPI;

  const deptProgress = serverData?.deptProgress || DEPT_PROGRESS;
  const totalAccidents = accidents.reduce((sum, a) => sum + a.count, 0) || 1;

  return (
    <div className="app-shell">
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />
      <div className="ad-frame">
        <div className="ad-topbar">
          <div className="ad-brand">
            <span>🛡️</span>
            <strong>SafeLab Admin</strong>
          </div>
          <div className="ad-topbar-right">
            <span className="ad-admin-name">{admin?.id || 'admin'}</span>
            <button className="ad-logout" onClick={logout}>로그아웃</button>
          </div>
        </div>

        <div className="ad-hero">
          <div className="ad-hero-row">
            <h1>안녕하세요, 관리자님 👋</h1>
            <span className={`ad-server-badge ${serverStatus}`}>
              {serverStatus === 'live' && '🟢 백엔드 연동 중'}
              {serverStatus === 'offline' && '🟡 오프라인 모드 (mock)'}
              {serverStatus === 'idle' && '⏳ 백엔드 확인 중…'}
            </span>
          </div>
          <p>인하공전 4개 학과 안전교육 이수 현황과 사고 통계입니다.</p>
        </div>

        <section className="ad-kpis">
          <div className="ad-kpi">
            <div className="ad-kpi-label">전체 이수율</div>
            <div className="ad-kpi-value">{kpi.completionRate}%</div>
            <div className="ad-kpi-sub">약 {kpi.enrolledStudents} / 약 {kpi.totalStudents}명</div>
          </div>
          <div className="ad-kpi pending">
            <div className="ad-kpi-label">미이수자</div>
            <div className="ad-kpi-value">약 {kpi.pendingStudents}명</div>
            <button className="ad-kpi-link" onClick={() => setShowPending(true)}>명단 보기 →</button>
          </div>
          <div className="ad-kpi">
            <div className="ad-kpi-label">완료된 시나리오</div>
            <div className="ad-kpi-value">{kpi.scenariosCompleted.toLocaleString()}</div>
            <div className="ad-kpi-sub">누적 시뮬레이션</div>
          </div>
          <div className="ad-kpi alert">
            <div className="ad-kpi-label">최근 7일 사고신고</div>
            <div className="ad-kpi-value">{kpi.recentIncidents7d}건</div>
            <div className="ad-kpi-sub">안전원 통지 완료</div>
          </div>
        </section>

        {/* 관리자 빠른 접근 — 새로 추가된 모든 기능 진입점 */}
        <section className="ad-section">
          <div className="ad-section-head">
            <h2>관리자 빠른 접근</h2>
            <small>학교 전체 통합 뷰 · 학생 측 기능 · 콘텐츠 관리 · 보험 가입/청구 시연</small>
          </div>
          <div className="ad-quick-grid">
            {QUICK_LINKS.map((q) => (
              <button
                key={q.to}
                type="button"
                className={`ad-quick ad-quick--${q.tone || 'default'}`}
                onClick={() => navigate(q.to)}
              >
                <span className="ad-quick__icon">{q.icon}</span>
                <div className="ad-quick__body">
                  <strong>{q.label}</strong>
                  <small>{q.desc}</small>
                </div>
                <span className="ad-quick__arrow">→</span>
              </button>
            ))}
          </div>
        </section>

        <section className="ad-section">
          <div className="ad-section-head">
            <h2>학과별 이수 현황</h2>
            <small>시나리오 + 약관 퀴즈 완전 이수 비율 · 카드 클릭 시 학과 담당자 화면</small>
          </div>
          <div className="ad-dept-list">
            {deptProgress.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`ad-dept ad-dept--v2 risk-${d.risk}`}
                onClick={() => navigate(`/admin/dept/${d.id}`)}
                title={`${d.name} 담당자 대시보드 열기`}
              >
                <div className="ad-dept__head">
                  <div className="ad-dept__title">
                    <strong>{d.name}</strong>
                    {d.risk === 'high' && <span className="ad-dept__pill ad-dept__pill--high">⚠ 위험도 높음</span>}
                    {d.risk === 'mid'  && <span className="ad-dept__pill ad-dept__pill--mid">주의</span>}
                    {d.risk === 'low'  && <span className="ad-dept__pill ad-dept__pill--low">양호</span>}
                  </div>
                  <div className="ad-dept__rate">
                    <span className="ad-dept__rate-num">{d.rate}</span>
                    <span className="ad-dept__rate-pct">%</span>
                  </div>
                </div>
                <div className="ad-dept-bar">
                  <div className="ad-dept-fill" style={{ width: `${d.rate}%` }} />
                </div>
                <div className="ad-dept__foot">
                  <span>약 {d.completed} / 약 {d.total}명 이수</span>
                  <span className="ad-dept__cta">담당자 화면 열기 →</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="ad-section">
          <div className="ad-section-head">
            <h2>사고 유형 분포 (학기 누적)</h2>
            <small>「연구실안전공제」 약관 보장 카테고리 기준</small>
          </div>
          <div className="ad-accident">
            <div className="ad-accident-bar">
              {accidents.map((a, i) => (
                <div
                  key={i}
                  className="ad-accident-seg"
                  style={{ width: `${(a.count / totalAccidents) * 100}%`, background: ACCIDENT_TYPE_COLOR[a.type] || '#6B7280' }}
                  title={`${a.type} ${a.count}건`}
                />
              ))}
            </div>
            <div className="ad-accident-legend">
              {accidents.map((a, i) => (
                <div key={i} className="ad-accident-item">
                  <span className="ad-accident-dot" style={{ background: ACCIDENT_TYPE_COLOR[a.type] || '#6B7280' }} />
                  <span className="ad-accident-type">{a.type}</span>
                  <strong>{a.count}건</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ad-section">
          <div className="ad-section-head">
            <h2>최근 사고신고</h2>
            <small>안전원 통지 + 공제 청구 이력</small>
          </div>
          <div className="ad-incident-list">
            {incidents.map((it, i) => (
              <div key={i} className="ad-incident">
                <div className="ad-incident-date">{it.date}</div>
                <div className="ad-incident-body">
                  <strong>{it.dept}</strong>
                  <p>{it.summary}</p>
                </div>
                <span className="pill pill-red">{it.status}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="ad-footer-note">
          {serverStatus === 'live'
            ? <>KPI·학과별 이수율은 백엔드 <code>/api/safety/admin/progress</code> 응답을 사용 중입니다. 사고분포·최근사고는 시연 mock.</>
            : <>백엔드 미가동 — 시연용 mock 통계로 표시 중입니다. 운영 시 <code>/api/safety/admin/progress</code> 응답으로 대체됩니다.</>}
        </div>

        {showPending && (
          <div className="ad-modal" onClick={() => setShowPending(false)}>
            <div className="ad-modal-body" onClick={(e) => e.stopPropagation()}>
              <div className="ad-modal-head">
                <h3>미이수자 명단 ({pending.length}명)</h3>
                <button onClick={() => setShowPending(false)}>×</button>
              </div>
              <table className="ad-modal-table">
                <thead>
                  <tr>
                    <th>학번</th>
                    <th>이름</th>
                    <th>학과</th>
                    <th>진척</th>
                    <th>마감</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((s) => (
                    <tr key={s.studentNo}>
                      <td>{s.studentNo}</td>
                      <td>{s.name}</td>
                      <td>{s.dept}</td>
                      <td>{s.progress}</td>
                      <td className={s.daysLeft < 10 ? 'urgent' : ''}>D-{s.daysLeft}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="ad-modal-foot">
                <button className="t-btn t-btn-ghost" onClick={() => setShowPending(false)}>닫기</button>
                <button className="t-btn t-btn-primary">📧 단체 안내메일 발송</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

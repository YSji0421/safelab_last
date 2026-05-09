import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ADMIN_KPI,
  DEPT_PROGRESS,
  ACCIDENT_DISTRIBUTION,
  RECENT_INCIDENTS,
  PENDING_STUDENTS,
} from '../data/adminMockStats';
import { safetyApi } from '../services/api';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [showPending, setShowPending] = useState(false);
  const [serverData, setServerData] = useState(null);
  const [serverStatus, setServerStatus] = useState('idle'); // idle | live | offline

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
        setServerData(res.data);
        setServerStatus('live');
      })
      .catch(() => {
        if (!alive) return;
        setServerStatus('offline');
      });
    return () => { alive = false; };
  }, []);

  const logout = () => {
    localStorage.removeItem('safelab.admin');
    navigate('/');
  };

  // 서버 데이터가 있으면 KPI/학과별 진척은 서버 우선, 사고분포/최근사고/미이수자는 mock 사용
  const kpi = serverData ? {
    totalStudents: serverData.totalStudents,
    enrolledStudents: serverData.enrolledStudents,
    completionRate: serverData.completionRate,
    pendingStudents: serverData.pendingStudents,
    recentIncidents7d: serverData.recentIncidents7d,
    scenariosCompleted: serverData.scenariosCompleted,
  } : ADMIN_KPI;

  const deptProgress = serverData?.deptProgress || DEPT_PROGRESS;
  const totalAccidents = ACCIDENT_DISTRIBUTION.reduce((sum, a) => sum + a.count, 0);

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
            <div className="ad-kpi-sub">{kpi.enrolledStudents} / {kpi.totalStudents}명</div>
          </div>
          <div className="ad-kpi pending">
            <div className="ad-kpi-label">미이수자</div>
            <div className="ad-kpi-value">{kpi.pendingStudents}명</div>
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

        <section className="ad-section">
          <div className="ad-section-head">
            <h2>학과별 이수 현황</h2>
            <small>시나리오 + 약관 퀴즈 완전 이수 비율</small>
          </div>
          <div className="ad-dept-list">
            {deptProgress.map((d) => (
              <div key={d.id} className={`ad-dept risk-${d.risk}`}>
                <div className="ad-dept-row">
                  <strong>{d.name}</strong>
                  <span>{d.completed} / {d.total}명 ({d.rate}%)</span>
                </div>
                <div className="ad-dept-bar">
                  <div className="ad-dept-fill" style={{ width: `${d.rate}%` }} />
                </div>
                <div className="ad-dept-meta">
                  {d.risk === 'high' && <span className="pill pill-red">⚠ 위험도 높음</span>}
                  {d.risk === 'mid' && <span className="pill" style={{ background: '#FEF3C7', color: '#92400E' }}>주의</span>}
                  {d.risk === 'low' && <span className="pill pill-green">양호</span>}
                </div>
              </div>
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
              {ACCIDENT_DISTRIBUTION.map((a, i) => (
                <div
                  key={i}
                  className="ad-accident-seg"
                  style={{ width: `${(a.count / totalAccidents) * 100}%`, background: a.color }}
                  title={`${a.type} ${a.count}건`}
                />
              ))}
            </div>
            <div className="ad-accident-legend">
              {ACCIDENT_DISTRIBUTION.map((a, i) => (
                <div key={i} className="ad-accident-item">
                  <span className="ad-accident-dot" style={{ background: a.color }} />
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
            {RECENT_INCIDENTS.map((it, i) => (
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
                <h3>미이수자 명단 ({PENDING_STUDENTS.length}명)</h3>
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
                  {PENDING_STUDENTS.map((s) => (
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

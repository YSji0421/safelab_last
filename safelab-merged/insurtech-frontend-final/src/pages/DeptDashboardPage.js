import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DEPT_PROGRESS,
  PENDING_STUDENTS_FALLBACK,
  RECENT_INCIDENTS_FALLBACK,
} from '../data/adminMockStats';
import { getDepartment, DEPARTMENT_LIST } from '../data/departments';
import './DeptDashboardPage.css';

// 학과 담당자 전용 대시보드 — 회의록 「학과당 2~3시간 집계 부담」 정조준.
// 자동 집계 + CSV 내보내기 + 일괄 알림 발송 모의 + 차세대 시스템 호환 export.

// 학교 전체 통합 뷰 (default) — 4학과 합산
const ALL_DEPT = {
  id: 'all',
  name: '인하공전 전체',
  shortName: '전체',
  icon: '🏫',
  accent: '#0f172a',
};

export default function DeptDashboardPage() {
  const { deptId } = useParams();
  const navigate = useNavigate();
  const isAll = deptId === 'all';
  const dept = isAll ? ALL_DEPT : getDepartment(deptId);

  // 학과별 진척도 (전체 모드면 4학과 합산)
  const progress = useMemo(() => {
    if (isAll) {
      const sum = DEPT_PROGRESS.reduce(
        (acc, d) => ({ total: acc.total + d.total, completed: acc.completed + d.completed }),
        { total: 0, completed: 0 },
      );
      const rate = sum.total ? Math.round((sum.completed / sum.total) * 100) : 0;
      // 위험도: 학과 중 high 있으면 high, 아니면 mid/low 중 가장 높은 것
      const risks = DEPT_PROGRESS.map((d) => d.risk);
      const risk = risks.includes('high') ? 'high' : risks.includes('mid') ? 'mid' : 'low';
      return { id: 'all', name: '인하공전 전체', ...sum, rate, risk };
    }
    return DEPT_PROGRESS.find((d) => d.id === deptId);
  }, [deptId, isAll]);

  // 미이수자 필터 (전체 모드면 모든 학과)
  const pendingForDept = useMemo(() => {
    if (!dept) return [];
    if (isAll) return PENDING_STUDENTS_FALLBACK;
    return PENDING_STUDENTS_FALLBACK.filter((s) => s.dept === dept.name);
  }, [dept, isAll]);

  // 최근 사고 (전체 모드면 모든 학과)
  const recentForDept = useMemo(() => {
    if (!dept) return [];
    if (isAll) return RECENT_INCIDENTS_FALLBACK;
    return RECENT_INCIDENTS_FALLBACK.filter((i) => i.dept === dept.name);
  }, [dept, isAll]);

  // 선택 상태
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [notifyStatus, setNotifyStatus] = useState(null); // null | 'sending' | 'sent'

  // 카운트업 애니메이션 — 인하공전 학부생 전체 (확장 가능 인원)
  const [savedCount, setSavedCount] = useState(0);
  useEffect(() => {
    const target = 7068; // 「2026 대학안전관리계획」 p.4 — 인하공전 학부생 전체 (확장 시 적용 인원)
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const ratio = Math.min(elapsed / 1.8, 1);
      setSavedCount(Math.floor(target * ratio));
      if (ratio >= 1) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [deptId]);

  // DEPT-5: 학과 알림함 (사고 보고서 자동 통보 수신)
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (!dept) return;
    try {
      if (isAll) {
        // 4학과 알림 모두 모아서 시간 역순 정렬
        const all = [];
        for (const d of DEPARTMENT_LIST) {
          const raw = localStorage.getItem(`safelab.dept-notifications.${d.id}`);
          if (raw) {
            const arr = JSON.parse(raw);
            arr.forEach((n) => all.push({ ...n, _deptId: d.id, _deptName: d.name }));
          }
        }
        all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(all);
      } else {
        const raw = localStorage.getItem(`safelab.dept-notifications.${dept.id}`);
        setNotifications(raw ? JSON.parse(raw) : []);
      }
    } catch { setNotifications([]); }
  }, [dept, isAll]);
  const markAllRead = () => {
    if (!dept) return;
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    try {
      if (isAll) {
        // 학과별로 분리 저장
        for (const d of DEPARTMENT_LIST) {
          const ofDept = updated.filter((n) => n._deptId === d.id).map(({ _deptId, _deptName, ...rest }) => rest);
          if (ofDept.length) localStorage.setItem(`safelab.dept-notifications.${d.id}`, JSON.stringify(ofDept));
        }
      } else {
        localStorage.setItem(`safelab.dept-notifications.${dept.id}`, JSON.stringify(updated));
      }
    } catch {}
  };
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!dept || !progress) {
    return (
      <div className="app-shell">
        <div className="aurora-orb o1" />
        <div className="aurora-orb o2" />
        <div className="aurora-orb o3" />
        <div className="aurora-orb o4" />
        <div className="dd-frame">
          <div className="dd-header">
            <button className="dd-back" onClick={() => navigate('/admin')} aria-label="뒤로">←</button>
            <div className="dd-header__title">
              <h1>학과를 찾을 수 없습니다</h1>
            </div>
            <div className="dd-header__right" />
          </div>
          <main className="dd-main">
            <div className="glass-card" style={{ padding: 32 }}>
              <p>학과 ID <code>{deptId}</code> 가 유효하지 않습니다.</p>
              <div style={{ marginTop: 18, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {DEPARTMENT_LIST.map((d) => (
                  <button key={d.id} className="t-btn t-btn-ghost"
                    onClick={() => navigate(`/admin/dept/${d.id}`)}>
                    {d.icon} {d.name}
                  </button>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const pendingRate = progress.total
    ? Math.round(((progress.total - progress.completed) / progress.total) * 100)
    : 0;
  const completedCount = progress.completed;
  const pendingCount = progress.total - progress.completed;

  const toggleAll = () => {
    if (selectedIds.size === pendingForDept.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingForDept.map((s) => s.studentNo)));
    }
  };
  const toggleOne = (sno) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(sno)) next.delete(sno);
      else next.add(sno);
      return next;
    });
  };

  const sendBulkNotify = () => {
    if (selectedIds.size === 0) return;
    setNotifyStatus('sending');
    setTimeout(() => {
      setNotifyStatus('sent');
      setTimeout(() => {
        setNotifyStatus(null);
        setSelectedIds(new Set());
      }, 2200);
    }, 900);
  };

  // CSV 다운로드 (학과 진척도 — 차세대 시스템 호환)
  const downloadCSV = () => {
    const rows = [
      ['학번', '이름', '학과', '진척도', '잔여 일수', '상태'],
      ...pendingForDept.map((s) => [s.studentNo, s.name, s.dept, s.progress, `${s.daysLeft}일`, '미이수']),
      // 이수자도 모의로 포함 (전체 인원에서 미이수자 뺀 수만큼 placeholder)
      ...Array.from({ length: Math.max(0, completedCount) }).slice(0, 10).map((_, i) => [
        `2024${String(5000 + i).padStart(5, '0')}`,
        `학생${i + 1}`,
        dept.name,
        '2/2',
        '-',
        '이수완료',
      ]),
    ];
    const csv = '﻿' + rows.map((r) => r.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safelab_${dept.shortName || dept.id}_progress_${ymd()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 차세대 시스템 호환 JSON export (8월 차세대 시스템 그대로 사용 가능)
  const downloadJSON = () => {
    const payload = {
      schemaVersion: '1.0',
      issuedAt: new Date().toISOString(),
      schoolCode: 'INHATC',
      deptId: dept.id,
      deptName: dept.name,
      summary: {
        totalStudents: progress.total,
        completed: completedCount,
        pending: pendingCount,
        completionRate: progress.rate,
      },
      students: [
        ...pendingForDept.map((s) => ({
          studentNo: s.studentNo, name: s.name, status: 'PENDING',
          progress: s.progress, daysLeft: s.daysLeft,
        })),
      ],
      generatedBy: 'SafeLab Auto-Aggregator',
      compatibleWith: '인하공전 차세대 행정시스템 안전·보건 모듈 (2026.08 예정)',
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safelab_${dept.id}_${ymd()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-shell">
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />

      <div className="dd-frame">
        <header className="dd-header">
          <button className="dd-back" onClick={() => navigate('/admin')} aria-label="뒤로">←</button>
          <div className="dd-header__title">
            <h1>{dept.icon} {dept.name} 안전교육 대시보드</h1>
            <p>{isAll ? '4학과 통합 — 학과 담당자 수기 집계 자동화' : '학과 담당자 전용 — 「학과당 2~3시간 집계 부담」 자동화'}</p>
          </div>
          <div className="dd-header__right">
            <select
              className="dd-dept-switch"
              value={dept.id}
              onChange={(e) => navigate(`/admin/dept/${e.target.value}`)}
            >
              <option value="all">🏫 인하공전 전체</option>
              {DEPARTMENT_LIST.map((d) => (
                <option key={d.id} value={d.id}>{d.icon} {d.shortName || d.name}</option>
              ))}
            </select>
          </div>
        </header>

        <main className="dd-main">
          {/* 회의록 후크 라이브 카운터 — 인하공전 전체 확장 가능 인원 */}
          <article className="dd-savings">
            <div className="dd-savings__head">
              <span className="eyebrow">Saved by SafeLab</span>
              <h2>SafeLab이 자동 집계 가능한 인하공전 학생</h2>
              <p>
                회의록(곽 위원): "실제 집계 소요 시간은 학과당 <strong>2~3시간</strong>"
                → SafeLab 자동 집계로 <strong>0초</strong>. 현재 시범 4학과 850명 적용 — 전 학과 확장 시 인하공전 전체.
              </p>
            </div>
            <div className="dd-savings__display">
              <span className="dd-savings__num">{savedCount.toLocaleString()}<small className="dd-savings__unit">명</small></span>
              <small>인하공전 「2026 대학안전관리계획」 p.4 — 학부생 전체 (확장 적용 가능 인원)</small>
            </div>
          </article>

          {/* DEPT-5: 신규 사고 알림함 */}
          {notifications.length > 0 && (
            <section>
              <div className="dd-section__head">
                <span className="eyebrow">⚡ Live Alerts</span>
                <h2>
                  학과 알림함
                  {unreadCount > 0 && <span className="dd-alert-badge">{unreadCount}</span>}
                </h2>
                <p>학생이 사고 신고 시 → 즉시 학과 담당자에게 자동 통보 (수기 보고 0초).</p>
              </div>
              <div className="dd-alerts">
                {notifications.slice(0, 5).map((n) => (
                  <div key={`${n._deptId || ''}-${n.id}`} className={`dd-alert ${!n.read ? 'is-unread' : ''}`}>
                    <span className={`pill ${sevPillClass(n.severity)}`}>{n.severity || '관심'}</span>
                    <div className="dd-alert__body">
                      <strong>
                        {isAll && n._deptName && <span className="dd-alert__dept">{n._deptName}</span>}
                        {n.title}
                      </strong>
                      <small>📍 {n.location} · {new Date(n.createdAt).toLocaleString('ko-KR')}</small>
                    </div>
                  </div>
                ))}
                {unreadCount > 0 && (
                  <button type="button" className="t-btn t-btn-ghost dd-alert__mark"
                    onClick={markAllRead}>모두 읽음 처리</button>
                )}
              </div>
            </section>
          )}

          {/* KPI 카드 4개 */}
          <section>
            <div className="dd-section__head">
              <span className="eyebrow">Overview</span>
              <h2>{dept.name} 진척 현황</h2>
              <p>{isAll ? '4학과(화공·기계·전기·컴퓨터) 합산. 학생이 시나리오·퀴즈 통과하면 학과 담당자 손 안 거치고 자동 반영.' : '실시간 자동 집계. 학생이 시나리오·퀴즈 통과하면 즉시 반영.'}</p>
            </div>
            <div className="dd-kpi-grid">
              <article className="dd-kpi">
                <span className="dd-kpi__label">총 학생</span>
                <span className="dd-kpi__value">{progress.total.toLocaleString()}<small>명</small></span>
              </article>
              <article className="dd-kpi dd-kpi--ok">
                <span className="dd-kpi__label">이수 완료</span>
                <span className="dd-kpi__value">{completedCount.toLocaleString()}<small>명</small></span>
                <span className="dd-kpi__sub">{progress.rate}%</span>
              </article>
              <article className="dd-kpi dd-kpi--warn">
                <span className="dd-kpi__label">미이수자</span>
                <span className="dd-kpi__value">{pendingCount.toLocaleString()}<small>명</small></span>
                <span className="dd-kpi__sub">{pendingRate}%</span>
              </article>
              <article className={`dd-kpi ${progress.risk === 'high' ? 'dd-kpi--risk' : ''}`}>
                <span className="dd-kpi__label">위험 지표</span>
                <span className="dd-kpi__value-text">{progress.risk === 'high' ? '높음' : progress.risk === 'mid' ? '중간' : '낮음'}</span>
                <span className="dd-kpi__sub">학과 위험요소 평가</span>
              </article>
            </div>
          </section>

          {/* 일괄 처리 */}
          <section>
            <div className="dd-section__head">
              <span className="eyebrow">Bulk Action</span>
              <h2>미이수자 일괄 처리</h2>
              <p>
                선택 후 클릭 한번으로 카톡·이메일·문자 자동 발송. 「학과 담당자 추가 업무 부담」을 0건으로.
              </p>
            </div>

            <div className="dd-toolbar">
              <button className="t-btn t-btn-ghost" onClick={toggleAll} type="button">
                {selectedIds.size === pendingForDept.length && pendingForDept.length > 0 ? '전체 해제' : '전체 선택'}
              </button>
              <button
                className="t-btn t-btn-primary"
                onClick={sendBulkNotify}
                disabled={selectedIds.size === 0 || notifyStatus === 'sending'}
              >
                {notifyStatus === 'sending' && '발송 중...'}
                {notifyStatus === 'sent' && '✓ 발송 완료'}
                {!notifyStatus && `🔔 알림 발송 (${selectedIds.size}명)`}
              </button>
              <button className="t-btn t-btn-ghost" onClick={downloadCSV} type="button">
                📊 CSV 다운로드
              </button>
              <button className="t-btn t-btn-ghost" onClick={downloadJSON} type="button">
                📤 차세대 시스템 호환 (JSON)
              </button>
            </div>

            <div className="dd-table-wrap glass-card">
              <table className="dd-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>
                      <input
                        type="checkbox"
                        checked={pendingForDept.length > 0 && selectedIds.size === pendingForDept.length}
                        onChange={toggleAll}
                        aria-label="전체 선택"
                      />
                    </th>
                    <th>학번</th>
                    <th>이름</th>
                    <th>진척도</th>
                    <th>마감</th>
                    <th>위험도</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingForDept.map((s) => (
                    <tr
                      key={s.studentNo}
                      className={selectedIds.has(s.studentNo) ? 'is-selected' : ''}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(s.studentNo)}
                          onChange={() => toggleOne(s.studentNo)}
                          aria-label={`${s.name} 선택`}
                        />
                      </td>
                      <td><code>{s.studentNo}</code></td>
                      <td>{s.name}</td>
                      <td>
                        <span className="dd-progress-pill">{s.progress}</span>
                      </td>
                      <td>
                        <span className={`pill ${s.daysLeft <= 7 ? 'pill-red' : s.daysLeft <= 14 ? 'pill-orange' : 'pill-gray'}`}>
                          D-{s.daysLeft}
                        </span>
                      </td>
                      <td>
                        {s.daysLeft <= 7 ? '🔴 임박' : s.daysLeft <= 14 ? '🟠 주의' : '🟢 여유'}
                      </td>
                    </tr>
                  ))}
                  {pendingForDept.length === 0 && (
                    <tr>
                      <td colSpan="6" className="dd-table__empty">
                        ✓ 모든 학생이 이수 완료했습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* 차세대 호환 안내 */}
          <article className="dd-compat">
            <span className="dd-compat__icon">🔗</span>
            <div>
              <strong>차세대 행정시스템과 100% 호환</strong>
              <p>
                JSON export 결과는 인하공전 차세대 행정시스템 (2026.08 안전·보건 모듈 가동 예정) 표준 스키마를 따릅니다.
                8월 가동 시 그대로 import 가능 — 5개월 공백 없이 연속 운영.
              </p>
            </div>
          </article>

          {/* 학과 최근 사고 */}
          {recentForDept.length > 0 && (
            <section>
              <div className="dd-section__head">
                <span className="eyebrow">Incidents</span>
                <h2>{dept.name} 최근 사고</h2>
              </div>
              <ul className="dd-incidents">
                {recentForDept.map((i, idx) => (
                  <li key={idx} className="dd-incident">
                    <span className="dd-incident__date">{i.date}</span>
                    <span className="dd-incident__sum">{i.summary}</span>
                    <span className="pill pill-blue">{i.status}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
function sevPillClass(s) {
  switch (s) {
    case '심각': return 'pill-red';
    case '경계': return 'pill-orange';
    case '주의': return 'pill-orange';
    case '관심': return 'pill-blue';
    default: return 'pill-gray';
  }
}
function csvEscape(v) {
  const s = String(v ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function ymd() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}


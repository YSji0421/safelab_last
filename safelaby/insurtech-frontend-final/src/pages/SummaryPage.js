import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import PageHeader from '../components/PageHeader';
import './SummaryPage.css';

export default function SummaryPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem('consultHistory') || '[]');
    const found = h.find((x) => x.roomId === roomId);
    setData(
      found || {
        roomId,
        date: new Date().toLocaleString('ko-KR'),
        title: 'AI 상담 요약',
        transcript: [],
        analysis: null,
        duration: 0,
      }
    );
  }, [roomId]);

  const fmtDur = (s) => (s ? `${Math.floor(s / 60)}분 ${s % 60}초` : '-');
  const riskColor = { 높음: '#ef4444', 보통: '#f59e0b', 낮음: '#10b981' };
  const toneColor = {
    불안: '#7c3aed',
    불만: '#ef4444',
    차분: '#10b981',
    적극적: '#3b82f6',
  };

  return (
    <AppShell variant="summary-shell">
      <PageHeader title="AI 상담 요약" subtitle={data?.date} backTo="/" />
      <div className="page-body">
        <div className="banner banner-success">
          <span style={{ fontSize: 18 }}>✅</span> 상담이 성공적으로 종료되었습니다
        </div>

        <section className="glass-card">
          <h3 className="card-title">📋 상담 정보</h3>
          <div className="status-list">
            <div className="status-row">
              <span className="status-row__label">⏱ 진행 시간</span>
              <span className="pill pill-blue">{fmtDur(data?.duration)}</span>
            </div>
            <div className="status-row">
              <span className="status-row__label">🆔 방 ID</span>
              <span className="pill pill-gray">{roomId?.slice(-8)}</span>
            </div>
          </div>
        </section>

        {data?.analysis ? (
          <>
            <section className="glass-card">
              <h3 className="card-title">📝 상담 요약</h3>
              <p className="summary-text">{data.analysis.summary}</p>
            </section>

            <section className="glass-card">
              <h3 className="card-title">🔍 분석 결과</h3>
              <div className="badge-row">
                <span
                  className="s-badge"
                  style={{
                    background:
                      toneColor[data.analysis.customerTone] || '#6b7280',
                  }}
                >
                  감정: {data.analysis.customerTone}
                </span>
                <span
                  className="s-badge"
                  style={{
                    background:
                      riskColor[data.analysis.riskLevel] || '#6b7280',
                  }}
                >
                  위험도: {data.analysis.riskLevel}
                </span>
              </div>
              <div className="kw-row">
                {data.analysis.keywords?.map((k, i) => (
                  <span key={i} className="kw-tag">
                    {k}
                  </span>
                ))}
              </div>
            </section>

            <section className="glass-card">
              <h3 className="card-title">✅ 후속 조치</h3>
              <ul className="action-list">
                {data.analysis.actionItems?.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </section>

            <section className="glass-card hint-box">
              <h3 className="card-title">💡 합의 방향</h3>
              <p>{data.analysis.settlementHint}</p>
            </section>
          </>
        ) : (
          <section className="glass-card">
            <p style={{ color: 'var(--ink-mute)' }}>AI 분석 결과가 없습니다.</p>
            <p style={{ color: 'var(--ink-mute)', fontSize: 12, marginTop: 6 }}>
              상담 중 'AI 분석' 버튼을 클릭하면 Gemini가 분석합니다.
            </p>
          </section>
        )}

        <div className="action-row" style={{ flexDirection: 'column', gap: 8 }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="t-btn t-btn-primary t-btn-block"
          >
            🏠 홈으로
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="t-btn t-btn-ghost t-btn-block"
          >
            📊 관리자 대시보드
          </button>
          <button
            type="button"
            onClick={() => navigate('/insurance/consult')}
            className="t-btn t-btn-ghost t-btn-block"
          >
            📹 새 상담 시작
          </button>
        </div>
      </div>
    </AppShell>
  );
}

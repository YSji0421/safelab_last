import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLoginPage.css';

const ADMIN_ID = 'admin';
const ADMIN_PW = 'admin1234';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (id === ADMIN_ID && pw === ADMIN_PW) {
      localStorage.setItem(
        'safelab.admin',
        JSON.stringify({ id, loggedAt: new Date().toISOString() })
      );
      navigate('/admin');
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="app-shell">
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />

      <div className="al-frame">
        <button
          className="al-back"
          onClick={() => navigate('/')}
          aria-label="뒤로"
        >
          ←
        </button>

        <div className="al-split">
          {/* 좌측: 인포 패널 (데스크톱에서만 노출) */}
          <aside className="al-info">
            <span className="eyebrow">SafeLab Admin</span>
            <h2 className="al-info__title">
              안전 데이터를<br />한 화면에서.
            </h2>
            <p className="al-info__desc">
              학과·연구실별 이수율, 미이수자, 사고 리포트, 공제 청구 현황을
              실시간으로 추적하세요.
            </p>
            <ul className="al-info__list">
              <li>
                <span className="al-info__bullet">📊</span>
                <div>
                  <strong>실시간 KPI</strong>
                  <span>이수율 / 활성 실험실 / 미이수자 / 리스크 점수</span>
                </div>
              </li>
              <li>
                <span className="al-info__bullet">🧪</span>
                <div>
                  <strong>학과별 진척</strong>
                  <span>화공·기계·전기·컴퓨터 트랙 한눈에</span>
                </div>
              </li>
              <li>
                <span className="al-info__bullet">📜</span>
                <div>
                  <strong>약관 인용 리포트</strong>
                  <span>「제26조」 의무 가입 자동 점검</span>
                </div>
              </li>
            </ul>
            <p className="al-info__legal">
              「연구실 안전환경 조성에 관한 법률」 제26조 ·
              한국교육시설안전원 연구실안전공제
            </p>
          </aside>

          {/* 우측: 로그인 카드 */}
          <main className="al-card">
            <div className="al-card__head">
              <div className="al-logo" aria-hidden>
                🧑‍💼
              </div>
              <h1>관리자 로그인</h1>
              <p>학과 안전관리자 / 총책임자 전용</p>
            </div>

            <form className="al-form" onSubmit={handleLogin} noValidate>
              <div className="al-field">
                <label htmlFor="al-id">아이디</label>
                <input
                  id="al-id"
                  className="t-input"
                  autoComplete="username"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="admin"
                />
              </div>
              <div className="al-field">
                <label htmlFor="al-pw">비밀번호</label>
                <input
                  id="al-pw"
                  className="t-input"
                  type="password"
                  autoComplete="current-password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {error && <div className="al-error">{error}</div>}

              <button
                className="t-btn t-btn-primary t-btn-block"
                type="submit"
              >
                로그인
              </button>

              <div className="al-hint">
                <span className="al-hint__icon">🧪</span>
                <span>시연 계정</span>
                <code>admin</code>
                <span className="al-hint__sep">/</span>
                <code>admin1234</code>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

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
      localStorage.setItem('safelab.admin', JSON.stringify({ id, loggedAt: new Date().toISOString() }));
      navigate('/admin');
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="app-shell">
      <div className="mobile-frame al-frame">
        <div className="al-header">
          <button className="al-back" onClick={() => navigate('/')} aria-label="뒤로">←</button>
          <div className="al-logo">🧑‍💼</div>
          <h1>관리자 로그인</h1>
          <p>학과 안전관리자/총책임자 전용</p>
        </div>

        <form className="al-form" onSubmit={handleLogin}>
          <div className="al-field">
            <label>아이디</label>
            <input
              className="t-input"
              autoComplete="username"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="admin"
            />
          </div>
          <div className="al-field">
            <label>비밀번호</label>
            <input
              className="t-input"
              type="password"
              autoComplete="current-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="admin1234"
            />
          </div>

          {error && <div className="al-error">{error}</div>}

          <button className="t-btn t-btn-primary t-btn-block" type="submit">
            로그인
          </button>

          <div className="al-hint">
            🧪 시연 계정: <code>admin</code> / <code>admin1234</code>
          </div>
        </form>
      </div>
    </div>
  );
}

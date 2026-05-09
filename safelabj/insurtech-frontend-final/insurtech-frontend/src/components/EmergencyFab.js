import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './EmergencyFab.css';

export default function EmergencyFab() {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  // 보험 상담 흐름은 페이지 내 액션 줄에 긴급 버튼을 직접 넣으므로 떠다니는 FAB 숨김
  const hideOn =
    path === '/' ||
    path === '/emergency' ||
    path.startsWith('/admin/login') ||
    path.startsWith('/insurance/') ||
    path.startsWith('/device-check') ||
    path.startsWith('/room/') ||
    path.startsWith('/summary/');
  if (hideOn) {
    return null;
  }

  return (
    <button
      className="emergency-fab"
      onClick={() => navigate('/emergency')}
      aria-label="긴급 연락처"
      title="긴급 연락처 바로가기"
    >
      <span className="emergency-fab-icon">🚨</span>
      <span className="emergency-fab-label">긴급</span>
    </button>
  );
}

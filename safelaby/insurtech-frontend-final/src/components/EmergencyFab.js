import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './EmergencyFab.css';

export default function EmergencyFab() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/' || location.pathname === '/emergency' || location.pathname.startsWith('/admin/login')) {
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

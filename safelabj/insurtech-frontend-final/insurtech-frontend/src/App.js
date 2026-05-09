import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EntryPage from './pages/EntryPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DepartmentSelectPage from './pages/DepartmentSelectPage';
import SafetyMainPage from './pages/SafetyMainPage';
import SafetyScenarioPage from './pages/SafetyScenarioPage';
import SafetyQuizPage from './pages/SafetyQuizPage';
import CertificatePage from './pages/CertificatePage';
import EmergencyPage from './pages/EmergencyPage';
import EmergencyFab from './components/EmergencyFab';

// 보험 부분 — "이후로 분리" 요구에 맞춰 별도 라우트로 유지
import DeviceCheckPage from './pages/DeviceCheckPage';
import ConsultationRoomPage from './pages/ConsultationRoomPage';
import SummaryPage from './pages/SummaryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 진입 분기 */}
        <Route path="/" element={<EntryPage />} />

        {/* 관리자 */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />

        {/* 학생 안전교육 */}
        <Route path="/student/department" element={<DepartmentSelectPage />} />
        <Route path="/student/safety/:dept" element={<SafetyMainPage />} />
        <Route path="/student/safety/:dept/scenario/:sid" element={<SafetyScenarioPage />} />
        <Route path="/student/safety/:dept/quiz/:sid" element={<SafetyQuizPage />} />
        <Route path="/student/safety/:dept/certificate" element={<CertificatePage />} />

        {/* 긴급 */}
        <Route path="/emergency" element={<EmergencyPage />} />

        {/* 보험 부분 (분리 모듈) */}
        <Route path="/insurance/consult" element={<DeviceCheckPage />} />
        <Route path="/insurance/room/:roomId" element={<ConsultationRoomPage />} />
        <Route path="/insurance/summary/:roomId" element={<SummaryPage />} />

        {/* 레거시 호환 — 기존 보험 페이지가 사용하는 옛 경로 흡수 */}
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/main" element={<Navigate to="/" replace />} />
        <Route path="/device-check" element={<DeviceCheckPage />} />
        <Route path="/room/:roomId" element={<ConsultationRoomPage />} />
        <Route path="/summary/:roomId" element={<SummaryPage />} />
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

        {/* 그 외 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <EmergencyFab />
    </BrowserRouter>
  );
}

export default App;

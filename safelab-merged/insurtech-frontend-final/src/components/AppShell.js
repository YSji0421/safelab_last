import React from 'react';

// SafeLab 공통 페이지 셸. 모든 라우트가 동일한 구조를 갖도록 통일:
//   .app-shell (Aurora orb 배경 + noise overlay, theme.css)
//   └── .mobile-frame (max-width 모바일 폭, padding-bottom: 80px)
//        └── 페이지 본문 (children)
//
// EntryPage / DepartmentSelectPage / SafetyMainPage 등 안전교육 흐름은 이미
// 직접 .app-shell + .mobile-frame 을 쓰고 있고, 이 컴포넌트는 보험 모듈
// (DeviceCheck / ConsultationRoom / Summary) 과 SafetyLandingPage 처럼 전에
// 다른 컨테이너를 쓰던 페이지를 같은 셸로 끌어들이기 위함.
//
// props:
//   variant   추가 클래스 (예: 'entry-v3', 'admin-shell')
//   noFrame   true면 mobile-frame 없이 풀폭 (랜딩 데스크톱 노출용 — 이번엔 미사용)
export default function AppShell({ variant = '', noFrame = false, children }) {
  return (
    <div className={`app-shell ${variant}`.trim()}>
      <div className="aurora-orb o1" aria-hidden="true" />
      <div className="aurora-orb o2" aria-hidden="true" />
      <div className="aurora-orb o3" aria-hidden="true" />
      <div className="aurora-orb o4" aria-hidden="true" />
      {noFrame ? children : <div className="mobile-frame">{children}</div>}
    </div>
  );
}

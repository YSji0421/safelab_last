import React from 'react';
import { useNavigate } from 'react-router-dom';

// SafeLab 공통 페이지 헤더 — DepartmentSelectPage / SafetyMainPage 등에서 쓰는
// 좌측 ←뒤로가기, 가운데 제목, 우측(선택) 액션 버튼 구조를 그대로.
//
// props:
//   title       제목
//   subtitle    부제목 (선택)
//   onBack      뒤로가기 핸들러 (없으면 navigate(-1))
//   backTo      뒤로가기 경로 (있으면 onBack 무시)
//   right       우측 슬롯 (선택, 액션 버튼 등)
//   variant     추가 클래스
export default function PageHeader({
  title,
  subtitle,
  onBack,
  backTo,
  right,
  variant = '',
}) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (onBack) return onBack();
    if (backTo) return navigate(backTo);
    return navigate(-1);
  };
  return (
    <header className={`page-header ${variant}`.trim()}>
      <button
        type="button"
        className="page-header__back"
        onClick={handleBack}
        aria-label="뒤로 가기"
      >
        ←
      </button>
      <div className="page-header__title">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="page-header__right">{right}</div>
    </header>
  );
}

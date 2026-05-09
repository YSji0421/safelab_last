import React from 'react';
import { Link } from 'react-router-dom';

// to:
//   '#anchor'        → 같은 페이지 내 앵커 (<a>)
//   'http(s)://...'  → 외부 링크 (<a target="_blank">)
//   '/route'         → React Router SPA 이동 (<Link>)
//   undefined/null   → <button>
export default function SmartLink({ to, children, className, ...rest }) {
  if (!to) {
    return (
      <button type="button" className={className} {...rest}>
        {children}
      </button>
    );
  }
  if (to.startsWith('#')) {
    return (
      <a href={to} className={className} {...rest}>
        {children}
      </a>
    );
  }
  if (/^https?:\/\//.test(to)) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className} {...rest}>
      {children}
    </Link>
  );
}

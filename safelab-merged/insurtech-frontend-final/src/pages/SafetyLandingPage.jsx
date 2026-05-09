// SafeLab 외부 소개 랜딩.
// - .app-shell + Aurora orb 4개로 다른 페이지와 동일한 배경 시스템 사용
// - .mobile-frame 안에 컨텐츠를 두어 데스크톱에서도 휴대폰 앱처럼 보이게
// - 안쪽에 .landing-root 를 두어 Tailwind 격리 스코프 진입 (important: '.landing-root')
// 카피/데이터 수정: src/data/landing.js · 컬러 토큰: src/index.css :root
import React from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import WhySafelab from '../components/landing/WhySafelab';
import Lineup from '../components/landing/Lineup';
import ContactForm from '../components/landing/ContactForm';
import Footer from '../components/landing/Footer';
import { ToastProvider } from '../hooks/useToast';

export default function SafetyLandingPage() {
  return (
    <ToastProvider>
      <div className="app-shell landing-shell-root">
        <div className="aurora-orb o1" aria-hidden="true" />
        <div className="aurora-orb o2" aria-hidden="true" />
        <div className="aurora-orb o3" aria-hidden="true" />
        <div className="aurora-orb o4" aria-hidden="true" />
        <div className="mobile-frame">
          <div className="landing-root font-sans antialiased">
            <Header />
            <main>
              <Hero />
              <About />
              <WhySafelab />
              <Lineup />
              <ContactForm />
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}

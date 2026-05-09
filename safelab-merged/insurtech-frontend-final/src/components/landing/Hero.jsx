import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  HardHat,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  ScrollText,
  Activity,
  TrendingUp,
} from 'lucide-react';
import SmartLink from './SmartLink';
import { HERO } from '../../data/landing';

// Bento grid hero — Linear/Vercel/Apple Vision Pro 발표 페이지 톤.
// 좌측 헤드라인(큰 영역) + 우측 일러스트(큰 영역) + 하단 4개 supplement 카드.
export default function Hero() {
  const [imgError, setImgError] = useState(false);
  const showImage = HERO.image && !imgError;

  return (
    <section id="hero" className="relative overflow-hidden">
      {/* 배경 글로우 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full bg-brand-primary/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-24 h-[480px] w-[480px] rounded-full bg-brand-accent/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-dots opacity-50"
      />

      {/* 초대형 워드마크 */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-20 select-none pointer-events-none"
      >
        <p
          className="hero-mega text-center text-transparent"
          style={{ WebkitTextStroke: '1.5px rgba(37,99,235,0.14)' }}
        >
          {HERO.megaText}
        </p>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8 pt-12 md:pt-16 pb-20 md:pb-28">
        {/* 페이지네이터 + eyebrow */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <span className="font-display font-bold text-text-primary text-base">
              {HERO.indicator.current}
            </span>
            <span>/</span>
            <span>{HERO.indicator.total}</span>
            <div className="ml-3 flex items-center gap-1">
              <button
                type="button"
                aria-label="이전 슬라이드"
                className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-black/10 bg-white/70 hover:bg-white transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="다음 슬라이드"
                className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-black/10 bg-white/70 hover:bg-white transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur border border-black/5 px-3 py-1.5 text-[11px] font-semibold text-brand-primary">
            <Sparkles size={12} /> 2026 인하공전 경진대회 출품
          </span>
        </div>

        {/* ──────── Bento Grid ──────── */}
        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 auto-rows-auto">
          {/* 헤드라인 (큰 좌측) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="md:col-span-7 lg:col-span-7 rounded-3xl bg-white/70 backdrop-blur border border-black/5 shadow-sm p-7 md:p-10 flex flex-col justify-between min-h-[420px] md:min-h-[480px]"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 text-[11px] font-semibold text-brand-primary">
                <CheckCircle2 size={12} /> 연구실 안전교육 + 연구실안전공제
              </span>
              <h1 className="mt-5 font-display font-extrabold text-4xl md:text-5xl lg:text-[64px] leading-[1.02] tracking-[-0.025em] whitespace-pre-line">
                {HERO.headline}
              </h1>
              <p className="mt-5 max-w-xl text-base md:text-lg text-text-muted leading-relaxed">
                {HERO.subcopy}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <SmartLink
                to={HERO.ctaPrimary.to}
                className="inline-flex items-center gap-2 rounded-full bg-text-primary text-white px-6 py-3.5 text-sm font-semibold shadow-lg transition hover:scale-[1.03] hover:shadow-xl active:scale-[0.98] no-underline"
              >
                {HERO.ctaPrimary.label}
                <ArrowRight size={16} />
              </SmartLink>
              <SmartLink
                to={HERO.ctaSecondary.to}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 backdrop-blur px-6 py-3.5 text-sm font-semibold text-text-primary transition hover:bg-white hover:scale-[1.02] no-underline"
              >
                {HERO.ctaSecondary.label}
                <ArrowRight size={16} />
              </SmartLink>
            </div>
          </motion.div>

          {/* 메인 일러스트 (큰 우측) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="md:col-span-5 lg:col-span-5 rounded-3xl border border-white shadow-xl overflow-hidden relative bg-gradient-to-br from-brand-primary/15 via-white to-brand-secondary/15 min-h-[420px] md:min-h-[480px]"
            role="img"
            aria-label={HERO.imageAlt || '안전교육 비주얼'}
          >
            {showImage ? (
              <img
                src={process.env.PUBLIC_URL + HERO.image}
                alt={HERO.imageAlt || ''}
                onError={() => setImgError(true)}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <>
                <div className="absolute inset-0 grid-dots opacity-60" aria-hidden="true" />
                <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-brand-primary/30 blur-2xl" aria-hidden="true" />
                <div className="absolute -bottom-8 -left-8 h-44 w-44 rounded-full bg-brand-accent/30 blur-2xl" aria-hidden="true" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                  <div className="h-28 w-28 rounded-3xl bg-white/90 backdrop-blur border border-black/5 shadow-glow flex items-center justify-center animate-float-y">
                    <ShieldCheck size={56} className="text-brand-primary" strokeWidth={2.2} />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 rounded-2xl bg-white/90 border border-black/5 shadow flex items-center justify-center">
                      <HardHat size={28} className="text-brand-accent" />
                    </div>
                    <div className="h-16 w-16 rounded-2xl bg-brand-primary text-white shadow-glow flex items-center justify-center font-display font-extrabold">
                      A+
                    </div>
                    <div className="h-16 w-16 rounded-2xl bg-white/90 border border-black/5 shadow flex items-center justify-center">
                      <CheckCircle2 size={28} className="text-brand-secondary" />
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* 우상 floating chip */}
            <div className="absolute top-4 right-4 rounded-2xl bg-white/95 backdrop-blur border border-black/5 shadow-lg px-3.5 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                Risk
              </p>
              <p className="font-display font-extrabold text-base text-brand-secondary leading-tight">
                Low
              </p>
              <p className="text-[10px] text-text-muted">실험실 평균</p>
            </div>
            {/* 좌하 floating chip */}
            <div className="absolute bottom-4 left-4 rounded-2xl bg-white/95 backdrop-blur border border-black/5 shadow-lg px-3.5 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                Completion
              </p>
              <p className="font-display font-extrabold text-base text-text-primary leading-tight">
                94.2%
              </p>
              <p className="text-[10px] text-text-muted">올해 이수율</p>
            </div>
          </motion.div>

          {/* ── 하단 Bento row: 4개 supplementary 카드 ── */}
          <BentoCard
            delay={0.1}
            className="md:col-span-3 bg-text-primary text-white"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
                Stats
              </span>
              <TrendingUp size={16} className="text-white/80" />
            </div>
            <div className="mt-auto pt-6">
              <p className="font-display font-extrabold text-4xl md:text-[44px] leading-none">
                94.2<span className="text-2xl text-white/60">%</span>
              </p>
              <p className="mt-2 text-sm text-white/70">올해 이수율 — 작년 대비 +18%p</p>
            </div>
          </BentoCard>

          <BentoCard
            delay={0.15}
            className="md:col-span-3 bg-white/80 backdrop-blur"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                Coverage
              </span>
              <ScrollText size={16} className="text-text-muted" />
            </div>
            <div className="mt-auto pt-4">
              <p className="font-display font-extrabold text-2xl md:text-[28px] leading-tight tracking-tight">
                요양 · 장해 · 유족
                <br />
                입원 · 장의비
              </p>
              <p className="mt-2 text-xs text-text-muted">
                연구실안전공제 5종 보장
              </p>
            </div>
          </BentoCard>

          <BentoCard
            delay={0.2}
            className="md:col-span-3 bg-gradient-to-br from-brand-primary/15 via-white to-brand-secondary/15"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                학과 트랙
              </span>
              <GraduationCap size={16} className="text-text-muted" />
            </div>
            <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
              {['🧪 화공', '⚙️ 기계', '⚡ 전기', '💻 컴퓨터'].map((d) => (
                <div
                  key={d}
                  className="rounded-xl bg-white/80 backdrop-blur border border-black/5 px-2.5 py-1.5 text-xs font-semibold text-text-primary text-center"
                >
                  {d}
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard
            delay={0.25}
            className="md:col-span-3 bg-brand-accent/15"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                Compliance
              </span>
              <Activity size={16} className="text-brand-accent" />
            </div>
            <div className="mt-auto pt-4">
              <p className="font-display font-extrabold text-2xl md:text-[28px] leading-tight tracking-tight">
                「제26조」
              </p>
              <p className="mt-1 text-sm font-semibold text-text-primary">
                연구실 안전환경 조성에<br />관한 법률 의무 가입
              </p>
            </div>
          </BentoCard>
        </div>

        {/* 체크 라인 (선택) */}
        <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-muted">
          <li className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-brand-secondary" /> 법정의무교육 자동화
          </li>
          <li className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-brand-secondary" /> 공제료 차등 적용
          </li>
          <li className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-brand-secondary" /> 공제급여 청구 원클릭
          </li>
        </ul>
      </div>
    </section>
  );
}

function BentoCard({ delay = 0, className = '', children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
      className={`rounded-3xl border border-black/5 shadow-sm p-5 md:p-6 min-h-[180px] flex flex-col transition hover:-translate-y-1 hover:shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

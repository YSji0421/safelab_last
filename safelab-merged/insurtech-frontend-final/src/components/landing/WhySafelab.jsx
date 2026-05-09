import React from 'react';
import { motion } from 'framer-motion';
import {
  FlaskConical,
  HardHat,
  ShieldAlert,
  Activity,
  Building2,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { WHY_SAFELAB } from '../../data/landing';

// 「왜 SafeLab?」 — 인하공전 「2026 대학안전관리계획」 PDF 실제 피해현황 인용 카드.
// Bento grid 톤(Hero/About와 동일)으로 6개 카드 + 우측 푸터에 출처 표기.

const ICONS = {
  lab: FlaskConical,
  industrial: HardHat,
  sex: ShieldAlert,
  covid: Activity,
  buildings: Building2,
  insurance: ShieldCheck,
};

const TONE = {
  rose: { bg: 'bg-gradient-to-br from-rose-100 via-white to-rose-50', accent: 'text-rose-600', chipBg: 'bg-rose-100', chipText: 'text-rose-700' },
  amber: { bg: 'bg-gradient-to-br from-amber-100 via-white to-amber-50', accent: 'text-amber-600', chipBg: 'bg-amber-100', chipText: 'text-amber-700' },
  pink: { bg: 'bg-gradient-to-br from-pink-100 via-white to-pink-50', accent: 'text-pink-600', chipBg: 'bg-pink-100', chipText: 'text-pink-700' },
  violet: { bg: 'bg-gradient-to-br from-violet-100 via-white to-violet-50', accent: 'text-violet-600', chipBg: 'bg-violet-100', chipText: 'text-violet-700' },
  mint: { bg: 'bg-gradient-to-br from-emerald-100 via-white to-emerald-50', accent: 'text-emerald-600', chipBg: 'bg-emerald-100', chipText: 'text-emerald-700' },
  sky: { bg: 'bg-gradient-to-br from-sky-100 via-white to-sky-50', accent: 'text-sky-600', chipBg: 'bg-sky-100', chipText: 'text-sky-700' },
};

export default function WhySafelab() {
  return (
    <section id="why-safelab" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
            {WHY_SAFELAB.eyebrow}
          </p>
          <h2 className="mt-3 font-display font-extrabold text-3xl md:text-5xl tracking-tight">
            {WHY_SAFELAB.title}
          </h2>
          <p className="mt-5 text-base md:text-lg text-text-muted leading-relaxed">
            {WHY_SAFELAB.subtitle}
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {WHY_SAFELAB.stats.map((stat, idx) => {
            const Icon = ICONS[stat.key] || FileText;
            const tone = TONE[stat.tone] || TONE.rose;
            return (
              <motion.article
                key={stat.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: idx * 0.05 }}
                className={`relative rounded-3xl border border-black/5 shadow-sm p-6 md:p-7 min-h-[260px] flex flex-col transition hover:-translate-y-1 hover:shadow-xl ${tone.bg}`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${tone.chipBg} ${tone.chipText}`}
                  >
                    <Icon size={20} strokeWidth={2.2} />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                    {stat.source}
                  </span>
                </div>

                <div className="mt-auto pt-6">
                  <p className={`font-display font-extrabold text-4xl md:text-5xl leading-none ${tone.accent}`}>
                    {stat.figure}
                  </p>
                  <h3 className="mt-3 font-display font-bold text-lg text-text-primary leading-snug">
                    {stat.headline}
                  </h3>
                  <p className="mt-2 text-sm text-text-muted leading-relaxed">
                    {stat.detail}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-black/5 px-4 py-2 text-xs font-semibold text-text-muted"
        >
          <FileText size={14} className="text-brand-primary" />
          {WHY_SAFELAB.source}
        </motion.p>
      </div>
    </section>
  );
}

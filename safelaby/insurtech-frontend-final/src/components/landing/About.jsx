import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, QrCode, Gauge, LifeBuoy, ArrowUpRight } from 'lucide-react';
import SmartLink from './SmartLink';
import { ABOUT } from '../../data/landing';

const ICONS = { GraduationCap, QrCode, Gauge, LifeBuoy };

const TONE = {
  primary: {
    bg: 'bg-brand-primary',
    text: 'text-white',
    sub: 'text-white/80',
    chipBg: 'bg-white/20',
    chipText: 'text-white',
  },
  secondary: {
    bg: 'bg-brand-secondary',
    text: 'text-white',
    sub: 'text-white/85',
    chipBg: 'bg-white/20',
    chipText: 'text-white',
  },
  accent: {
    bg: 'bg-brand-accent',
    text: 'text-text-primary',
    sub: 'text-text-primary/75',
    chipBg: 'bg-white/40',
    chipText: 'text-text-primary',
  },
};

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
              {ABOUT.eyebrow}
            </p>
            <h2 className="mt-3 font-display font-extrabold text-3xl md:text-5xl tracking-tight">
              {ABOUT.title}
            </h2>
            <div className="mt-6 space-y-5 text-base md:text-lg text-text-muted leading-relaxed">
              {ABOUT.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <ul className="mt-8 flex flex-wrap gap-2" aria-label="키워드">
              {ABOUT.tags.map((tag) => (
                <li key={tag}>
                  <span className="inline-flex items-center rounded-full bg-brand-primary/10 text-brand-primary px-3 py-1.5 text-xs font-semibold">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              {ABOUT.cards.map((card, idx) => {
                const Icon = ICONS[card.icon] || LifeBuoy;
                const tone = TONE[card.tone] || TONE.primary;
                const sizeClass =
                  idx % 3 === 0 ? 'sm:row-span-1' : idx === 2 ? 'sm:translate-y-6' : '';
                return (
                  <SmartLink
                    key={card.title}
                    to={card.to}
                    aria-label={`${card.title} — ${card.desc}`}
                    className={`group relative overflow-hidden rounded-3xl p-6 md:p-7 border border-black/5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl block ${tone.bg} ${tone.text} ${sizeClass} no-underline`}
                  >
                    <div
                      aria-hidden="true"
                      className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                    />
                    <div className="flex items-start justify-between">
                      <span
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${tone.chipBg} ${tone.chipText}`}
                      >
                        <Icon size={20} strokeWidth={2.2} />
                      </span>
                      <span
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${tone.chipBg} ${tone.chipText} opacity-0 group-hover:opacity-100 transition`}
                        aria-hidden="true"
                      >
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                    <h3 className="mt-4 font-display font-bold text-xl">{card.title}</h3>
                    <p className={`mt-2 text-sm leading-relaxed ${tone.sub}`}>{card.desc}</p>
                  </SmartLink>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

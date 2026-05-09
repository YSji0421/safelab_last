import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpenCheck, ShieldCheck, Activity } from 'lucide-react';
import SmartLink from './SmartLink';
import { LINEUP } from '../../data/landing';

const ICONS = { BookOpenCheck, ShieldCheck, Activity };

function LineupCard({ item, idx }) {
  const Icon = ICONS[item.icon] || BookOpenCheck;
  const fallback = item.to || '#contact';
  const [imgError, setImgError] = useState(false);
  const showImage = item.image && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: idx * 0.08 }}
    >
      <SmartLink
        to={fallback}
        aria-label={`${item.name} — ${item.ctaLabel || item.desc}`}
        className="group relative block rounded-3xl p-5 bg-white border border-black/5 transition hover:-translate-y-1 hover:shadow-xl no-underline text-text-primary"
      >
        <div
          className={`relative h-52 rounded-3xl bg-gradient-to-br ${item.gradient} overflow-hidden`}
          role="img"
          aria-label={`${item.name} 비주얼`}
        >
          {showImage ? (
            <img
              src={process.env.PUBLIC_URL + item.image}
              alt={item.imageAlt || `${item.name} 비주얼`}
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <>
              <div
                className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-white/30 blur-2xl"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-black/10 blur-2xl"
                aria-hidden="true"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon size={84} strokeWidth={1.8} className="text-white drop-shadow" />
              </div>
            </>
          )}
          <span
            className={`absolute top-4 left-4 inline-flex items-center rounded-full ${item.pillBg} ${item.pillText} px-3 py-1 text-[11px] font-bold tracking-wide z-10`}
          >
            {String(idx + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="px-2 pt-5 pb-3">
          <h3 className="font-display font-extrabold text-xl">{item.name}</h3>
          <p className="mt-1.5 text-sm text-text-muted">{item.desc}</p>
          <p className="mt-3 text-sm text-text-primary/80 leading-relaxed">{item.detail}</p>
        </div>

        <div className="mt-2 inline-flex w-full items-center justify-between rounded-full bg-bg-soft border border-black/10 pl-5 pr-3 py-3 text-sm font-semibold transition group-hover:bg-text-primary group-hover:text-white">
          <span>{item.ctaLabel || item.name}</span>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </SmartLink>
    </motion.div>
  );
}

export default function Lineup() {
  return (
    <section id="lineup" className="relative py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
            {LINEUP.eyebrow}
          </p>
          <h2 className="mt-3 font-display font-extrabold text-3xl md:text-5xl tracking-tight">
            {LINEUP.title}
          </h2>
          <p className="mt-4 text-base md:text-lg text-text-muted">{LINEUP.subtitle}</p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6 md:gap-7">
          {LINEUP.items.map((item, idx) => (
            <LineupCard key={item.key} item={item} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

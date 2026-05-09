import React from 'react';
import { ShieldCheck, Instagram, Youtube, MessageCircle } from 'lucide-react';
import SmartLink from './SmartLink';
import { FOOTER, BRAND } from '../../data/landing';

const ICONS = { Instagram, Youtube, MessageCircle };

export default function Footer() {
  return (
    <footer className="relative bg-bg-soft border-t border-black/5">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-14">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary text-white shadow-glow">
                <ShieldCheck size={18} strokeWidth={2.4} />
              </span>
              <span className="font-display font-extrabold text-lg">{BRAND.name}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-text-muted leading-relaxed">
              {FOOTER.description}
            </p>
            <ul className="mt-5 flex items-center gap-2">
              {FOOTER.socials.map((s) => {
                const Icon = ICONS[s.icon] || MessageCircle;
                return (
                  <li key={s.label}>
                    <SmartLink
                      to={s.to}
                      aria-label={s.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-text-primary/80 transition hover:bg-brand-primary hover:text-white hover:border-transparent hover:scale-105"
                    >
                      <Icon size={16} />
                    </SmartLink>
                  </li>
                );
              })}
            </ul>
          </div>

          {FOOTER.columns.map((col) => (
            <div key={col.title} className="md:col-span-3">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-text-muted">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <SmartLink
                      to={link.to}
                      className="text-sm text-text-primary/80 hover:text-brand-primary transition"
                    >
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-1" />
        </div>

        <div className="mt-12 pt-6 border-t border-black/5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-text-muted">{FOOTER.copyright}</p>
          <p className="text-[11px] text-text-muted/80 tracking-widest uppercase">
            {BRAND.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}

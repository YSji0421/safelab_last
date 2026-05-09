import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, Send, Loader2 } from 'lucide-react';
import { CONTACT } from '../../data/landing';
import { useToast } from '../../hooks/useToast';

const ICONS = { Phone, Mail, MapPin, MessageCircle };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ org: '', name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = '담당자 이름을 입력해주세요.';
    if (!form.email.trim()) next.email = '연락 가능한 이메일을 입력해주세요.';
    else if (!EMAIL_RE.test(form.email.trim())) next.email = '이메일 형식이 올바르지 않습니다.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('필수 항목을 확인해주세요.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      // TODO: API 연결 — POST /api/inquiries
      await new Promise((r) => setTimeout(r, 600));
      showToast('문의가 접수되었습니다. 곧 회신드릴게요.');
      setForm({ org: '', name: '', email: '', message: '' });
    } catch {
      showToast('전송에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-32">
      {/* 풀폭 배경 — 차분한 그라디언트 + 도형. 사진 placeholder는 // TODO 위치에서 교체 가능 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#0b1d3a] via-[#10366d] to-[#0d9488]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 grid-dots opacity-25 mix-blend-overlay"
      />
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-brand-accent/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-24 h-[360px] w-[360px] rounded-full bg-brand-primary/40 blur-3xl"
      />
      {/* TODO: 실제 사무실/교육장 배경 사진으로 교체하려면 위 그라디언트 위에 <img className="absolute inset-0 w-full h-full object-cover opacity-30" .../> 추가 */}

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 text-white"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              {CONTACT.eyebrow}
            </p>
            <h2 className="mt-3 font-display font-extrabold text-3xl md:text-5xl tracking-tight">
              {CONTACT.title}
            </h2>
            <p className="mt-4 text-base md:text-lg text-white/80 leading-relaxed">
              {CONTACT.subtitle}
            </p>

            <ul className="mt-8 space-y-3">
              {CONTACT.info.map((item) => {
                const Icon = ICONS[item.icon] || Mail;
                return (
                  <li
                    key={item.label}
                    className="flex items-start gap-3 rounded-2xl bg-white/10 backdrop-blur border border-white/15 px-4 py-3"
                  >
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
                        {item.label}
                      </p>
                      <p className="text-sm text-white truncate">{item.value}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            noValidate
            onSubmit={onSubmit}
            className="lg:col-span-7 rounded-3xl bg-white/95 backdrop-blur border border-white/40 shadow-2xl p-6 md:p-8"
            aria-label="도입 문의 폼"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                id="org"
                label="회사 / 학교 (선택)"
                placeholder="예: 인하공업전문대학"
                value={form.org}
                onChange={update('org')}
              />
              <Field
                id="name"
                label="담당자 이름"
                required
                placeholder="이름을 입력해주세요"
                value={form.name}
                onChange={update('name')}
                error={errors.name}
              />
            </div>
            <Field
              id="email"
              type="email"
              label="이메일"
              required
              placeholder="example@school.ac.kr"
              value={form.email}
              onChange={update('email')}
              error={errors.email}
              className="mt-4"
            />
            <div className="mt-4">
              <label
                htmlFor="message"
                className="block text-xs font-semibold text-text-muted uppercase tracking-wider"
              >
                문의 내용 (선택)
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="도입 검토 중인 학과·규모·일정 등을 알려주시면 더 빠르게 안내드립니다."
                value={form.message}
                onChange={update('message')}
                className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 transition resize-none"
              />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-text-muted">
                제출 시 개인정보 처리 방침에 동의한 것으로 간주됩니다.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary text-white px-7 py-3.5 text-sm font-semibold shadow-glow transition hover:scale-[1.03] hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    전송 중...
                  </>
                ) : (
                  <>
                    {CONTACT.submitLabel}
                    <Send size={14} />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({ id, label, required, error, className = '', type = 'text', ...rest }) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-text-muted uppercase tracking-wider"
      >
        {label}
        {required && <span className="ml-1 text-brand-primary">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-1.5 w-full rounded-2xl border bg-white px-4 py-3 text-sm placeholder:text-text-muted/70 focus:outline-none focus:ring-2 transition ${
          error
            ? 'border-red-300 focus:ring-red-300'
            : 'border-black/10 focus:ring-brand-primary/40'
        }`}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

import React, { createContext, useCallback, useContext, useState, useRef, useEffect } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastViewport toasts={toasts} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ toasts }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto rounded-2xl px-5 py-3 shadow-xl backdrop-blur border text-sm font-medium animate-[fadeInUp_0.3s_ease] ${
            t.type === 'error'
              ? 'bg-red-50/90 border-red-200 text-red-700'
              : 'bg-white/90 border-brand-primary/20 text-brand-primary'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { showToast: () => {} };
  }
  return ctx;
}

// 백업: framer-motion 미사용 시 IntersectionObserver fade-up
export function useScrollFadeUp() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          ob.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    ob.observe(node);
    return () => ob.disconnect();
  }, []);
  return { ref, visible };
}

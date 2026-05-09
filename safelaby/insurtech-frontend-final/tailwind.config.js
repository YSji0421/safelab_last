/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/SafetyLandingPage.jsx',
    './src/components/landing/**/*.{js,jsx}',
    './src/hooks/useToast.js',
  ],
  important: '.landing-root',
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--brand-primary)',
          secondary: 'var(--brand-secondary)',
          accent: 'var(--brand-accent)',
          mint: 'var(--brand-mint)',
        },
        bg: {
          soft: 'var(--bg-soft)',
        },
        text: {
          primary: 'var(--text-primary)',
          muted: 'var(--text-muted)',
        },
      },
      fontFamily: {
        display: ['Manrope', 'Pretendard', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'Pretendard', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      boxShadow: {
        glow: '0 10px 40px -10px rgba(6, 182, 212, 0.45)',
        'glow-accent': '0 10px 40px -10px rgba(244, 114, 182, 0.45)',
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        'float-y': 'floatY 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

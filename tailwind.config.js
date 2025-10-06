/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0f0f12',
          soft: '#15161a',
        },
        foreground: '#e6e6eb',
        primary: {
          DEFAULT: '#7c3aed',
          foreground: '#ffffff',
          soft: '#a78bfa',
        },
        accent: {
          DEFAULT: '#e5e7eb',
          soft: '#f3f4f6',
          foreground: '#111827',
        },
        muted: {
          DEFAULT: '#2a2b31',
          foreground: '#b3b3bd',
        },
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
        md: '0 4px 24px rgba(0,0,0,.25)',
        xl: '0 20px 80px rgba(0,0,0,.35)',
      },
      borderRadius: {
        soft: '12px',
        xl: '18px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.25rem',
          lg: '2rem',
          xl: '2.5rem',
        },
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

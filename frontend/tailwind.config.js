/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        rq: {
          bg: 'rgb(var(--rq-bg-rgb) / <alpha-value>)',
          'bg-soft': 'rgb(var(--rq-bg-soft-rgb) / <alpha-value>)',
          surface: 'rgb(var(--rq-surface-rgb) / <alpha-value>)',
          'surface-raised': 'rgb(var(--rq-surface-raised-rgb) / <alpha-value>)',
          'surface-hover': 'rgb(var(--rq-surface-hover-rgb) / <alpha-value>)',
          border: 'rgb(var(--rq-border-rgb) / <alpha-value>)',
          'border-soft': 'rgb(var(--rq-border-soft-rgb) / <alpha-value>)',
          text: 'rgb(var(--rq-text-rgb) / <alpha-value>)',
          'text-secondary': 'rgb(var(--rq-text-secondary-rgb) / <alpha-value>)',
          'text-muted': 'rgb(var(--rq-text-muted-rgb) / <alpha-value>)',
          red: 'rgb(var(--rq-red-rgb) / <alpha-value>)',
          'red-soft': 'rgb(var(--rq-red-rgb) / 0.12)',
          orange: 'rgb(var(--rq-orange-rgb) / <alpha-value>)',
          'orange-soft': 'rgb(var(--rq-orange-rgb) / 0.12)',
          warning: 'rgb(var(--rq-warning-rgb) / <alpha-value>)',
          'warning-soft': 'rgb(var(--rq-warning-rgb) / 0.12)',
          success: 'rgb(var(--rq-success-rgb) / <alpha-value>)',
          'success-soft': 'rgb(var(--rq-success-rgb) / 0.12)',
          info: 'rgb(var(--rq-info-rgb) / <alpha-value>)',
          focus: 'rgb(var(--rq-focus-rgb) / <alpha-value>)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        panel: '0.875rem',
        control: '0.625rem'
      },
      boxShadow: {
        panel: '0 1px 2px rgb(15 23 42 / 0.04), 0 8px 24px rgb(15 23 42 / 0.05)'
      }
    }
  },
  plugins: []
};

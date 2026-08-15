/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
        },
        border: 'hsl(var(--border) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
        },
        destructive: 'hsl(var(--destructive) / <alpha-value>)',
        warning: 'hsl(var(--warning) / <alpha-value>)',
        success: 'hsl(var(--success) / <alpha-value>)',
        info: 'hsl(var(--info) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)'
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

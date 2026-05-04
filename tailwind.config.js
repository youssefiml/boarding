/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
        boarding: {
          navy: '#1A1F5C',
          blue: '#2B35AF',
          sand: '#F5ECD7',
          charcoal: '#1A1A2E',
          mist: '#9498C4',
          sunset: '#FF6B35',
        },
        brand: {
          50: '#eef4ff',
          100: '#dbe8ff',
          200: '#b9d3ff',
          300: '#85b3ff',
          400: '#4e8cff',
          500: '#2868f0',
          600: '#1d4fd0',
          700: '#1a40a8',
          800: '#1a3884',
          900: '#182f6d',
        },
        accent: {
          50: '#eafaf7',
          100: '#cef4ed',
          200: '#9ee9dc',
          300: '#67dac7',
          400: '#35c0af',
          500: '#1d9e90',
          600: '#167f75',
          700: '#15655f',
          800: '#154f4c',
          900: '#133f3d',
        },
      },
      fontFamily: {
        body: ['Outfit', 'Segoe UI', 'sans-serif'],
        display: ['Syne', 'Outfit', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        panel: '0 24px 60px -36px rgba(15, 23, 42, 0.38)',
        panelStrong: '0 28px 70px -34px rgba(15, 23, 42, 0.48)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        landingFloat: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -8px, 0)' },
        },
        'hero-globe-float': {
          '0%, 100%': { transform: 'translate(-50%, -52%) scale(1)' },
          '50%': { transform: 'translate(-50%, -54%) scale(1.015)' },
        },
        'hero-plane-pulse': {
          '0%, 100%': { opacity: '0.85', transform: 'translate(-48%, -58%) scale(1)' },
          '50%': { opacity: '1', transform: 'translate(-48%, -59%) scale(1.02)' },
        },
        'hero-tag-float': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '12%': { opacity: '1', transform: 'translateY(0)' },
          '50%': { opacity: '1', transform: 'translateY(-6px)' },
          '88%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.45s ease-out both',
        'pulse-soft': 'pulseSoft 1.6s ease-in-out infinite',
        'landing-float': 'landingFloat 6s ease-in-out infinite',
        'hero-globe-float': 'hero-globe-float 9s ease-in-out infinite',
        'hero-plane-pulse': 'hero-plane-pulse 4s ease-in-out infinite',
        'hero-tag-float': 'hero-tag-float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

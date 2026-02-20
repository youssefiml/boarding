/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
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
        body: ['Public Sans', 'Segoe UI', 'sans-serif'],
        display: ['Space Grotesk', 'Public Sans', 'sans-serif'],
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
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.45s ease-out both',
        'pulse-soft': 'pulseSoft 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

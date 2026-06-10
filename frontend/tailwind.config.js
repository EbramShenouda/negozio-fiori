/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Verde salvia – colore primario brand
        brand: {
          50:  '#f4f9f6',
          100: '#e2f0e8',
          200: '#c3e0d0',
          300: '#97c9b0',
          400: '#65ad8c',
          500: '#4a7c59', // principale
          600: '#3a6447',
          700: '#2e4f38',
          800: '#253f2d',
          900: '#1c3122',
        },
        // Rosa tenue – accento floreale
        petal: {
          50:  '#fff5f8',
          100: '#ffe8ef',
          200: '#ffd0e0',
          300: '#ffadc4',
          400: '#f4a7b9', // principale
          500: '#e8859e',
          600: '#d0607f',
        },
        // Crema caldo – sfondo principale
        cream: {
          DEFAULT: '#faf8f5',
          50:  '#fdfcfa',
          100: '#faf8f5',
          200: '#f3ede4',
        },
        // Beige naturale – secondario
        natural: {
          100: '#f5f0e8',
          200: '#ece3d5',
          300: '#d4c5a9', // principale
          400: '#b8a48a',
          500: '#9a8268',
        },
      },

      fontFamily: {
        serif:  ['"Playfair Display"', 'Georgia', 'serif'],
        sans:   ['"Inter"', 'system-ui', 'sans-serif'],
      },

      boxShadow: {
        'soft':    '0 2px 15px -3px rgba(74, 124, 89, 0.07), 0 10px 20px -2px rgba(74, 124, 89, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(74, 124, 89, 0.15)',
        'card':    '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.06)',
      },

      animation: {
        'fade-in':     'fadeIn 0.5s ease-in-out',
        'slide-up':    'slideUp 0.5s ease-out',
        'pulse-soft':  'pulseSoft 2s ease-in-out infinite',
      },

      keyframes: {
        fadeIn:    { '0%': { opacity: '0' },                            '100%': { opacity: '1' } },
        slideUp:   { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
      },
    },
  },
  plugins: [],
};

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        'surface-dark': '#0b0b0b',
        'surface-card': '#121212',
        'surface-border': '#1e1e1e',
        gold: {
          50: '#FBF8EE',
          100: '#F6EFCF',
          200: '#EEDDA0',
          300: '#E4C76D',
          400: '#D4AF37', // signature metallic gold
          500: '#C5A059',
          600: '#A9822E',
          700: '#7E5F1E',
          800: '#564015',
          900: '#32250B',
          light: '#F3E5AB',
          champagne: '#EADBB6',
          bronze: '#8C6D2D',
        },
      },
      fontFamily: {
        cinematic: ['var(--font-cinematic)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.3)',
        'gold-glow-lg': '0 0 50px -10px rgba(212, 175, 55, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2.5s infinite linear',
        'subtle-pulse': 'subtlePulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '0.9' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

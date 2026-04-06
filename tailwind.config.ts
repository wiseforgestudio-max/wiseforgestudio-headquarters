import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#34d874',
          dim: '#1a6b3a',
          glow: 'rgba(52,216,116,0.15)',
        },
        accent: {
          DEFAULT: '#6366f1',
          dim: 'rgba(99,102,241,0.15)',
        },
        bg: {
          base: '#050508',
          2: '#09090f',
          surface: '#0f0f17',
          muted: '#141420',
          strong: '#1a1a28',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          strong: 'rgba(255,255,255,0.13)',
          brand: 'rgba(52,216,116,0.25)',
        },
        ink: {
          DEFAULT: '#f0f0f5',
          muted: '#7a7a9a',
          dim: '#4a4a6a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'var(--font-inter)', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'scroll-x': 'scrollX 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        scrollX: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'hero-glow':
          'radial-gradient(ellipse 80% 60% at 65% 50%, rgba(52,216,116,0.08) 0%, transparent 65%)',
        'brand-gradient':
          'linear-gradient(135deg, #34d874 0%, #1a9e57 100%)',
        'card-gradient':
          'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
      },
    },
  },
  plugins: [],
}

export default config

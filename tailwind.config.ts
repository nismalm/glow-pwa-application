import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f5f3ef',
        card: '#ffffff',
        line: '#ececec',
        ink: {
          DEFAULT: '#1a1a1a',
          soft: '#6b6b6b',
          mute: '#a0a0a0',
        },
        accent: {
          DEFAULT: '#cdde3f',
          deep: '#a8b92f',
        },
        coral: '#ff7a6b',
        lilac: '#b8a4ff',
        sky: '#5ec8ff',
        water: {
          DEFAULT: '#2aa7ff',
          deep: '#1989e8',
        },
        ok: '#3ec97a',
        amber: '#ffb347',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 16px 0 rgba(0,0,0,0.07)',
        float: '0 8px 32px 0 rgba(0,0,0,0.12)',
      },
      borderRadius: {
        phone: '54px',
      },
    },
  },
  plugins: [],
} satisfies Config

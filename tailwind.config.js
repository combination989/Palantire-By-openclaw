/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'red-alert': '#ff0033',
        'orange-alert': '#ff6600',
        'cyan-terminal': '#00ff88',
        'yellow-warning': '#ffcc00',
        terminal: {
          black: '#000000',
          dark: '#050505',
          panel: '#0a0a0a',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s steps(1) infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

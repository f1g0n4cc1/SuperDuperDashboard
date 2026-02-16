/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        batcave: {
          bg: '#050505',
          glass: 'rgba(15, 15, 15, 0.75)',
          border: 'rgba(255, 255, 255, 0.12)',
          text: '#EDEDED',
        }
      },
      backdropBlur: {
        bat: '16px',
      }
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.glass-panel': {
          'backdrop-filter': 'blur(16px)',
          'background-color': 'rgba(15, 15, 15, 0.75)',
          'border': '1px solid rgba(255, 255, 255, 0.12)',
          'box-shadow': '0 25px 50px -12px rgb(0 0 0 / 0.5)',
          'transform': 'translateZ(0)',
          'will-change': 'backdrop-filter',
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }
      })
    })
  ],
}

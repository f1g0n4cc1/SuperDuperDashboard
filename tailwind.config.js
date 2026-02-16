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
          bg: '#05090e',      // Deep background
          panel: '#0d121a',   // Card background
          accent: '#1e293b',  // Hover / Sidebar active
          blue: '#3b82f6',    // Primary / Tab active
          yellow: '#eab308',  // Event highlights
          red: '#ef4444',     // High priority badge
          green: '#22c55e',   // Low priority / Success
          text: {
            primary: '#f8fafc',
            secondary: '#94a3b8'
          }
        }
      },
      backdropBlur: {
        bat: '16px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
      }
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.glass-panel': {
          'backdrop-filter': 'blur(16px)',
          'background-color': 'rgba(13, 18, 26, 0.75)',
          'border': '1px solid rgba(255, 255, 255, 0.08)',
          'box-shadow': '0 25px 50px -12px rgb(0 0 0 / 0.5)',
          'transform': 'translateZ(0)',
          'will-change': 'backdrop-filter',
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }
      })
    })
  ],
}

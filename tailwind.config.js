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
        vault: {
          amber: '#FFB642',
          'amber-secondary': '#D49020',
          bg: '#141008',
          surface: '#241E14',
          'surface-light': '#32291a',
        },
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
      fontFamily: {
        mono: ['Share Tech Mono', 'Roboto Mono', 'monospace'],
        body: ['Courier New', 'monospace'],
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
          'background-color': 'rgba(36, 30, 20, 0.75)',
          'border': '1px solid rgba(255, 182, 66, 0.15)',
          'box-shadow': '0 0 20px rgba(255, 182, 66, 0.05)',
          'transform': 'translateZ(0)',
          'will-change': 'backdrop-filter',
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.vault-glow': {
          'text-shadow': '0 0 8px rgba(255, 182, 66, 0.6)',
        },
        '.crt-overlay': {
          'position': 'relative',
          'overflow': 'hidden',
          '&::before': {
            'content': '""',
            'position': 'absolute',
            'top': '0', 'left': '0', 'right': '0', 'bottom': '0',
            'background': 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
            'background-size': '100% 4px, 3px 100%',
            'pointer-events': 'none',
            'z-index': '50',
            'opacity': '0.15'
          }
        }
      })
    })
  ],
}

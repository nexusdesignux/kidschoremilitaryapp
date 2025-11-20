/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core backgrounds
        bg: {
          primary: '#000000',
          secondary: '#0a0a0a',
          tertiary: '#1a1a1a',
        },
        // Borders
        border: {
          primary: '#333333',
          active: '#00ff88',
          subtle: '#222222',
        },
        // Text colors
        text: {
          primary: '#ffffff',
          secondary: '#999999',
          muted: '#666666',
        },
        // Accent colors
        accent: {
          primary: '#00ff88',    // Neon green
          secondary: '#ffcc00',  // Gold
          danger: '#ff3b3b',     // Red
          info: '#00d4ff',       // Cyan
        },
        // Status colors
        status: {
          ready: '#00ff88',
          active: '#00d4ff',
          verification: '#ffcc00',
          complete: '#00ff88',
          overdue: '#ff3b3b',
        },
        // Difficulty colors
        difficulty: {
          easy: '#00ff88',
          medium: '#ffcc00',
          hard: '#ff3b3b',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': '11px',
        'sm': '13px',
        'base': '15px',
        'lg': '18px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '48px',
      },
      borderRadius: {
        'none': '0px',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.5)',
        'glow-gold': '0 0 10px rgba(255, 204, 0, 0.5)',
        'glow-modal': '0 20px 60px rgba(0, 255, 136, 0.2)',
      },
    },
  },
  plugins: [],
}

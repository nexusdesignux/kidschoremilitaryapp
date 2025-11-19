/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Military color palette
        military: {
          navy: {
            50: '#e6e9ed',
            100: '#b3bcc8',
            200: '#8091a3',
            300: '#4d667e',
            400: '#1a3b59',
            500: '#1a2332', // Primary navy
            600: '#151c28',
            700: '#10151e',
            800: '#0b0e14',
            900: '#06070a',
          },
          green: {
            50: '#e8f5e9',
            100: '#b9dec1',
            200: '#8ac799',
            300: '#5bb071',
            400: '#2c9949',
            500: '#3d8b40', // Tactical green primary
            600: '#316f33',
            700: '#255326',
            800: '#1a3719',
            900: '#0e1b0c',
            bright: '#52b556', // Bright accent
          },
          gold: {
            50: '#fffbeb',
            100: '#fff4c7',
            200: '#ffeda3',
            300: '#ffe67f',
            400: '#ffdf5b',
            500: '#ffc107', // Achievement gold
            600: '#cc9a06',
            700: '#997404',
            800: '#664d03',
            900: '#332701',
            bright: '#ffeb3b', // Bright achievement
          },
          orange: {
            50: '#fff4ed',
            100: '#ffd9c7',
            200: '#ffbea1',
            300: '#ffa37b',
            400: '#ff8855',
            500: '#ff6b35', // Alert orange
            600: '#cc562a',
            700: '#99401f',
            800: '#662b15',
            900: '#33150a',
          },
          blue: {
            50: '#e8f3fb',
            100: '#c2dcf3',
            200: '#9bc5eb',
            300: '#75aee3',
            400: '#4e97db',
            500: '#4a90e2', // Info blue
            600: '#3b73b5',
            700: '#2c5688',
            800: '#1d395a',
            900: '#0e1c2d',
          },
          red: {
            50: '#ffebee',
            100: '#ffc4cc',
            200: '#ff9daa',
            300: '#ff7688',
            400: '#ff4f66',
            500: '#ff5252', // Mission critical red
            600: '#cc4242',
            700: '#993131',
            800: '#662121',
            900: '#331010',
          },
          camo: {
            dark: '#2d3436',
            medium: '#636e72',
            light: '#b2bec3',
            sand: '#dfe6e9',
          },
        },
        // Semantic colors
        success: '#4caf50',
        warning: '#ff9800',
        error: '#ff5252',
        info: '#2196f3',
      },
      fontFamily: {
        tactical: ['Bebas Neue', 'Impact', 'Arial Black', 'sans-serif'],
        stencil: ['Orbitron', 'Rajdhani', 'sans-serif'],
        military: ['Teko', 'Saira Condensed', 'sans-serif'],
        action: ['Bungee', 'Impact', 'sans-serif'],
        body: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
        mono: ['Courier Prime', 'Courier New', 'monospace'],
      },
      fontSize: {
        'mission': ['3rem', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '900' }],
        'rank': ['2rem', { lineHeight: '1.2', letterSpacing: '0.1em', fontWeight: '700' }],
        'tactical': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0.05em', fontWeight: '600' }],
      },
      backgroundImage: {
        'tactical-grid': 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 20px)',
        'hazard-stripes': 'repeating-linear-gradient(45deg, #ffc107, #ffc107 20px, #1a2332 20px, #1a2332 40px)',
        'camo-pattern': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h30v30H0zm30 30h30v30H30z\' fill=\'%232d3436\' fill-opacity=\'0.1\'/%3E%3C/svg%3E")',
        'military-gradient': 'linear-gradient(135deg, #1a2332 0%, #1a3b59 50%, #1a2332 100%)',
        'rank-gradient': 'linear-gradient(to right, #ffc107, #ffeb3b, #ffc107)',
      },
      boxShadow: {
        'tactical': '0 0 20px rgba(61, 139, 64, 0.3), inset 0 0 10px rgba(0,0,0,0.5)',
        'mission': '0 4px 20px rgba(255, 193, 7, 0.4), 0 0 40px rgba(255, 193, 7, 0.2)',
        'rank': '0 0 30px rgba(74, 144, 226, 0.5)',
        'alert': '0 0 20px rgba(255, 82, 82, 0.6)',
        'hud': 'inset 0 0 20px rgba(0, 255, 0, 0.1), 0 0 10px rgba(0, 255, 0, 0.3)',
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'radar': 'spin 4s linear infinite',
        'blink': 'blink 1.5s step-end infinite',
        'slide-in': 'slideIn 0.5s ease-out',
        'rank-up': 'rankUp 0.8s ease-out',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '50.01%, 100%': { opacity: '0.3' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        rankUp: {
          '0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(10deg)' },
          '100%': { transform: 'scale(1) rotate(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

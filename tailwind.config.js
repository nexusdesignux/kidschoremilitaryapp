/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Military theme colors
        navy: {
          DEFAULT: '#1a2332',
          light: '#2a3442',
          dark: '#0a1322',
        },
        tactical: {
          DEFAULT: '#3d8b40',
          light: '#52b556',
          dark: '#2d6b30',
        },
        gold: {
          DEFAULT: '#ffc107',
          light: '#ffeb3b',
          dark: '#ff9800',
        },
        mission: {
          orange: '#ff6b35',
          blue: '#4a90e2',
          green: '#4caf50',
          red: '#ff5252',
        },
      },
      fontFamily: {
        header: ['Bangers', 'Bebas Neue', 'cursive'],
        bebas: ['Bebas Neue', 'cursive'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        extreme: {
          dark: '#0b0f19',
          card: '#151c2e',
          accent: '#00f0ff',
          neon: '#ff0055',
          gold: '#ffd700',
          green: '#00ff66',
        }
      },
      fontFamily: {
        karaoke: ['"Sarabun"', '"Prompt"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

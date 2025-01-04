/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { 
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'], // Rajdhani 추가
      },
    },
  },
  plugins: [],
}


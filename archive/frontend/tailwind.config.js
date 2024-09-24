/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'nba-pink': '#e32a52',
        'nba-pink-darker': '#b50038',
      },
  
      backgroundImage: {
        'nba': "url('../assets/nba_bg.svg')",
      }
    },
  },
  plugins: [],
}


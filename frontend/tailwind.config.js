/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'nba': "url('../assets/nba_bg.svg')",
      }
    },
  },
  plugins: [],
}


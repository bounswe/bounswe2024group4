/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme:{
    extend: {
      colors: {
        primary: '#6B46C1',  // Purple
        secondary: '#D6BCFA',  // Lighter Purple
        accent: '#B794F4', // Accent color
      },
    },
  },
  plugins: [],
};


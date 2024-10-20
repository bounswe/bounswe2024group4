/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], // Adjust according to your project structure
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#6B46C1', // Custom primary color (similar to purple-700)
        secondary: '#B794F4', // Light purple (used as accents if needed)
        darkBackground: '#1A202C', // Custom dark background (similar to gray-900)
        lightText: '#EDF2F7', // Custom soft white text (similar to gray-100)
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};



/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        purple: {
          500: '#9b59b6',  // Custom color for purple background
          600: '#8e44ad',  // Darker shade for active tab
        },
        gray: {
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',  // Light gray for inactive tab
          500: '#a0aec0',  // Gray background for inactive tab
          600: '#718096',  // Gray border or text color
        },
        white: '#ffffff',
      },
      borderRadius: {
        'full': '9999px',  // Ensure fully rounded buttons or tabs
        'lg': '12px',      // Ensure large radius for buttons or cards
      },
      transitionProperty: {
        'height': 'height', // Transition for height if needed
        'spacing': 'margin, padding', // Transition for margin/padding if needed
      },
      transitionTimingFunction: {
        'in-out': 'ease-in-out', // Custom transition timing function
      },
      transitionDuration: {
        '500': '500ms', // Default transition duration for smooth effects
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2980b9',
          hover: '#3498db'
        },
        secondary: {
          DEFAULT: '#ecf0f1',
          hover: '#bdc3c7'
        }
      },
      spacing: {
        '18': '4.5rem',
      },
      borderRadius: {
        DEFAULT: '0.5rem'
      }
    },
  },
  plugins: []
}
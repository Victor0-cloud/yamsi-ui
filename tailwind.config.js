/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yamsi: {
          50: '#f8f9ff',
          100: '#f0f2ff',
          200: '#e0e5ff',
          300: '#c7d0ff',
          400: '#a8b5ff',
          500: '#7c8aff',
          600: '#5a63ff',
          700: '#4a52ff',
          800: '#3d43ff',
          900: '#2d2fff',
        },
      },
    },
  },
  plugins: [],
}

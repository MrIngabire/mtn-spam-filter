/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mtn: {
          bg: '#0e0c07',
          surface: '#17140c',
          yellow: '#ffcc00',
          danger: '#ff5a3c',
          safe: '#2fb673',
          muted: '#9a927a',
        }
      }
    },
  },
  plugins: [],
}
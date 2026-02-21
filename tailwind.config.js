/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Adding a custom blood red to match your theme
        brandRed: '#dc2626',
      }
    },
  },
  plugins: [],
}
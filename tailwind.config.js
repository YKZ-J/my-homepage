/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // ← ここが重要
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
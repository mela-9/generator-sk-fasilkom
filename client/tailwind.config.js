/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'navy-fasilkom': '#1e293b',
        'abu-fasilkom': '#f8fafc',
      }
    },
  },
  plugins: [],
}
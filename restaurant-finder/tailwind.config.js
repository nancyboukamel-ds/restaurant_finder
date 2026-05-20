/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jet-orange': '#FF8000',
        'jet-orange-light': '#FFA040',
        'jet-orange-dark': '#E67300',
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#121824',
        'brand-card': '#283356'
      }
    }
  },
  plugins: []
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      boxShadow: {
        'shadow-profile': '0 4px 6px -1px #110528, 0 2px 4px -2px #110528',
      }
    },
  },
  plugins: [],
}

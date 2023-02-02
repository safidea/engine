// tailwind config is required for editor support

const { theme } = require('./src/config/tailwind.js')

/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme,
  plugins: [],
}

module.exports = tailwindConfig

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: ['src/infrastructure/ui/TailwindUI/*.tsx'],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}

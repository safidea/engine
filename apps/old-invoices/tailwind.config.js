/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '../../packages/client-component/dist/components/**/*.{js,jsx,mdx}',
    './app/**/*.{js,jsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}

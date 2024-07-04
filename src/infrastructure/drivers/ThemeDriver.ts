import fs from 'fs-extra'
import postcss from 'postcss'
import tailwindcss, { type Config } from 'tailwindcss'

export class ThemeDriver {
  async build() {
    const tailwindConfig: Config = {
      darkMode: 'class',
      content: ['./src/infrastructure/components/**/*.{ts,tsx}'],
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
              950: '#172554',
            },
          },
        },
      },
      fontFamily: {
        body: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
      },
      plugins: [],
    }

    // Define the input CSS with Tailwind directives
    const inputCss = `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    `

    // Process the CSS with PostCSS and Tailwind
    const result = await postcss([tailwindcss(tailwindConfig), require('autoprefixer')])
      .process(inputCss, { from: undefined })
      .then((result) => result.css)

    // Write the output CSS to a file
    await fs.ensureDir('./public')
    await fs.writeFile('./public/output.css', result)

    console.log('CSS generated with the provided theme')
  }
}

import type { Driver } from '@adapter/spi/ThemeSpi'
import type { Params } from '@domain/services/Theme'
import postcss from 'postcss'
import tailwindcss, { type Config } from 'tailwindcss'

export class ThemeDriver implements Driver{
  constructor(private params: Params) {}

  async build() {
    const config = this.params
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
        sans: config.fontFamily?.sans ?? [
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
    const { css } = await postcss([tailwindcss(tailwindConfig), require('autoprefixer')]).process(
      inputCss,
      { from: undefined }
    )

    return css
  }
}

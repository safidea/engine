import type { Driver } from '@adapter/spi/ThemeSpi'
import type { Params } from '@domain/services/Theme'
import { join } from 'path'
import postcss from 'postcss'
import tailwindcss, { type Config } from 'tailwindcss'

const dirname = new URL('.', import.meta.url).pathname

export class ThemeDriver implements Driver {
  constructor(public params: Params) {}

  build = async (fontsCss: string[]) => {
    const { fontFamily } = this.params
    const theme: Config['theme'] = {}

    if (fontFamily) {
      theme.fontFamily = {}
      if (fontFamily.sans) {
        const sans = fontFamily.sans.search(' ') === -1 ? fontFamily.sans : `"${fontFamily.sans}"`
        theme.fontFamily.sans = [sans, 'sans-serif']
      }
      if (fontFamily.serif) theme.fontFamily.serif = [fontFamily.serif, 'serif']
    }

    const tailwindConfig: Config = {
      darkMode: 'class',
      content: [join(dirname, '*.js')],
      theme,
    }

    // Define the input CSS with Tailwind directives
    let inputCss = `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    `

    if (fontsCss.length > 0) {
      inputCss += `
      @layer base {
        ${fontsCss.join('\n')}
      }
      `
    }

    // Process the CSS with PostCSS and Tailwind
    const { css } = await postcss([tailwindcss(tailwindConfig), require('autoprefixer')]).process(
      inputCss,
      { from: undefined }
    )

    return css
  }
}

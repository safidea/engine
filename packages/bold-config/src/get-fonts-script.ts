import type { Font, FontOptions } from '../types/config.type'

export default function getFontsScript(fonts: Font[]): string {
  let script = `import { Barlow, Inter } from '@next/font/google'

const primary = Barlow({
  subsets: [
    'latin'
  ],
  variable: '--font-barlow',
  weight: [
    '300',
    '400',
    '500',
    '700'
  ]
})

const secondary = Inter({
  subsets: [
    'latin'
  ],
  variable: '--font-inter',
  weight: [
    '300',
    '400',
    '500',
    '700'
  ]
})

const fonts = [primary.variable, secondary.variable]

export default fonts`

  if (fonts) {
    const [primaryName, secondaryName] = script.match(/(?<=\{\s|,\s)[a-zA-Z]+?(?=\s\}|,)/g) ?? []
    const [primaryOptions, secondaryOptions] = script.match(/(?<=\()\{.*?\}(?=\))/gs) ?? []

    const defaultFonts = {
      primary: {
        name: primaryName,
        options: primaryOptions,
      },
      secondary: {
        name: secondaryName,
        options: secondaryOptions,
      },
    }

    for (const font of fonts) {
      const defaultFont = defaultFonts[font.key as keyof typeof defaultFonts]
      if (!defaultFont) throw new Error(`Their is no font for key "${font.key}"`)

      if (defaultFont.name) {
        const defaultName = new RegExp(defaultFont.name, 'g')
        const newName = font.name.trim().replace(/ /g, '_')
        script = script.replace(defaultName, newName)
      }

      if (defaultFont.options) {
        const newOptions: FontOptions = {
          subsets: ['latin'],
          variable: `--font-${font.name.trim().toLowerCase().replace(/ /g, '-')}`,
          weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
        }
        if (font.weight) {
          newOptions.weight = Array.isArray(font.weight)
            ? font.weight.map((w: string | number) => String(w))
            : String(font.weight)
        }
        let newOptionsString = JSON.stringify(newOptions, null, 2)
        newOptionsString = newOptionsString.replace(/"/g, "'").replace(/'(?=:)|(?<=\n\s\s)'/g, '')
        script = script.replace(defaultFont.options, newOptionsString)
      }
    }
  }

  return script
}

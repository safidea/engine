import type { Font, Theme } from '../types/config.type'

export default function getTailwindScript(theme: Theme): string {
  const { fonts, ...props } = theme
  const tailwind = {
    ...props,
    extend: { ...props.extend, fontFamily: {} },
  }
  if (fonts) {
    tailwind.extend.fontFamily = fonts.reduce((acc: { [key: string]: string[] }, font: Font) => {
      if (font.name) {
        const [name, ...params] = font.name.split(',')
        const variable = `var(--font-${name.toLowerCase().replace(/ /g, '-')})`
        acc[font.key as keyof typeof acc] = [variable, ...params]
      }
      return acc
    }, {})
  }

  return `const theme = ${JSON.stringify(tailwind, null, 2)}
  
module.exports = { theme }`
}

import type { IFontLibraryDriver } from '@adapter/spi/drivers/FontLibrarySpi'

export class FontLibraryDriver implements IFontLibraryDriver {
  loadCss = async (name: string) => {
    const googleFontUrl = `https://fonts.googleapis.com/css2?family=${name}:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap`
    const response = await fetch(googleFontUrl)
    if (!response.ok) throw new Error(`FontLibraryDriver: failed to load font: ${name}`)
    const css = await response.text()
    return css
  }
}

import type { SansSerifFontName, SerifFontName } from '@domain/libraries/Font'
import type { Server } from './Server'
import type { FontLibrary } from './FontLibrary'
import { CssResponse } from '@domain/entities/Response/Css'

export interface ThemeConfig {
  fontFamily?: {
    sans?: SansSerifFontName
    serif?: SerifFontName
  }
  container?: {
    center?: boolean
    padding?:
      | string
      | {
          DEFAULT?: string
          sm?: string
          md?: string
          lg?: string
          xl?: string
          '2xl'?: string
        }
  }
}

export interface ThemeServices {
  server: Server
  fontLibrary: FontLibrary
}

export interface IThemeSpi {
  build: (htmlContents: string[], fontsCss?: string[]) => Promise<string>
}

export class Theme {
  constructor(
    private _spi: IThemeSpi,
    private _services: ThemeServices,
    private _config: ThemeConfig
  ) {}

  init = async (htmlContents: string[]) => {
    const { server, fontLibrary } = this._services
    const { fontFamily = {} } = this._config
    const { sans, serif } = fontFamily
    let fonts: string[] = []
    if (sans) fonts.push(sans)
    if (serif) fonts.push(serif)
    fonts = fonts.map((f) => encodeURIComponent(f))
    const fontsCss = []
    if (fonts.length > 0) {
      for (const font of fonts) {
        const css = await fontLibrary.loadCss(font)
        fontsCss.push(css)
      }
    }
    const css = await this._spi.build(htmlContents, fontsCss)
    await server.get('/output.css', async () => new CssResponse(css))
  }
}

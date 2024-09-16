import type { SansSerif, Serif } from '@domain/libraries/Font'
import type { Server } from './Server'
import type { FontLibrary } from './FontLibrary'
import { Css } from '@domain/entities/Response/Css'

export interface Config {
  fontFamily?: {
    sans?: SansSerif
    serif?: Serif
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

export interface Services {
  server: Server
  fontLibrary: FontLibrary
}

export interface Spi {
  build: (htmlContents: string[], fontsCss?: string[]) => Promise<string>
}

export class Theme {
  constructor(
    private _spi: Spi,
    private _services: Services,
    private _config: Config
  ) {}

  buildCss = async (htmlContents: string[]) => {
    return this._spi.build(htmlContents)
  }

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
    await server.get('/output.css', async () => new Css(css))
  }
}

import type { SansSerif, Serif } from '@domain/libraries/Font'
import type { Server } from './Server'
import type { FontLibrary } from './FontLibrary'
import { Css } from '@domain/entities/response/Css'

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

export interface Params extends Config {
  server: Server
  fontLibrary: FontLibrary
}

export interface Spi {
  params: Params
  build: (fontsCss: string[]) => Promise<string>
}

export class Theme {
  constructor(private spi: Spi) {}

  init = async () => {
    const { server, fontLibrary, fontFamily = {} } = this.spi.params
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
    const css = await this.spi.build(fontsCss)
    await server.get('/output.css', async () => new Css(css))
  }
}

import { Font, type Type } from '@domain/entities/response/Font'
import type { IdGenerator } from './IdGenerator'
import type { Server } from './Server'

export interface Params {
  server: Server
  idGenerator: IdGenerator
}

export interface Spi {
  params: Params
  loadCss: (name: string) => Promise<string>
}

export class FontLibrary {
  constructor(private spi: Spi) {}

  extractTypeFromUrl = (url: string): Type => {
    const type = url.split('.').pop()
    if (!type) throw new Error(`Failed to parse font type: ${url}`)
    if (type === 'woff' || type === 'woff2' || type === 'otf' || type === 'ttf') return type
    throw new Error(`Unsupported font type: ${type}`)
  }

  loadCss = async (name: string): Promise<string> => {
    const { server, idGenerator } = this.spi.params
    let css = await this.spi.loadCss(name)
    const urlRegex = /url\((https:\/\/[^)]+)\)/g
    let match
    while ((match = urlRegex.exec(css)) !== null) {
      const url = match[1]
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Failed to load font: ${url}`)
      const buffer = await response.arrayBuffer()
      const data = Buffer.from(buffer)
      const type = this.extractTypeFromUrl(url)
      const path = `/fonts/${name}/${idGenerator.forPath()}`
      await server.get(path, async () => new Font(data, type))
      css = css.replace(url, path)
    }
    return css
  }
}

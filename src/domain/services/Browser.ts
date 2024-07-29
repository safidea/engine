import { BrowserPage, type Spi as BrowserPageSpi } from './BrowserPage'
import type { IdGenerator } from './IdGenerator'

export interface Services {
  idGenerator: IdGenerator
}

export interface Spi {
  launch: (id: string) => Promise<void>
  newPage: (id: string, baseUrl: string) => Promise<BrowserPageSpi>
  close: (id: string) => Promise<void>
}

export class Browser {
  constructor(
    private _spi: Spi,
    private _services: Services
  ) {}

  launch = async () => {
    const { idGenerator } = this._services
    const id = idGenerator.forBrowser()
    await this._spi.launch(id)
    return id
  }

  newPage = async (id: string, baseUrl: string) => {
    const page = await this._spi.newPage(id, baseUrl)
    return new BrowserPage(page)
  }

  close = async (id: string) => {
    await this._spi.close(id)
  }
}

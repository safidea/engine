import { BrowserPage, type Spi as BrowserPageSpi } from './BrowserPage'

export interface Spi {
  launch: () => Promise<void>
  newPage: (baseUrl: string) => Promise<BrowserPageSpi>
  close: () => Promise<void>
}

export class Browser {
  constructor(private _spi: Spi) {}

  launch = async () => {
    await this._spi.launch()
  }

  newPage = async (baseUrl: string) => {
    const page = await this._spi.newPage(baseUrl)
    return new BrowserPage(page)
  }

  close = async () => {
    await this._spi.close()
  }
}

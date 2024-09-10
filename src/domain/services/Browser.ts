import { BrowserPage, type Spi as BrowserPageSpi } from './BrowserPage'

export interface Spi {
  launch: (baseUrl?: string) => Promise<BrowserPageSpi>
}

export class Browser {
  constructor(private _spi: Spi) {}

  launch = async (baseUrl?: string) => {
    const page = await this._spi.launch(baseUrl)
    return new BrowserPage(page)
  }
}

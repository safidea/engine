import { BrowserPage, type IBrowserPageSpi } from './BrowserPage'

export interface IBrowserSpi {
  launch: (baseUrl?: string) => Promise<IBrowserPageSpi>
}

export class Browser {
  constructor(private _spi: IBrowserSpi) {}

  launch = async (baseUrl?: string) => {
    const page = await this._spi.launch(baseUrl)
    return new BrowserPage(page)
  }
}

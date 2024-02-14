import { BrowserPage, type Spi as BrowserPageSpi } from './BrowserPage'

export interface Spi {
  launch: (baseUrl: string) => Promise<BrowserPageSpi>
  close: () => Promise<void>
}

export class Browser {
  constructor(private spi: Spi) {}

  launch = async (baseUrl: string) => {
    const page = await this.spi.launch(baseUrl)
    return new BrowserPage(page)
  }

  close = async () => {
    await this.spi.close()
  }
}

import { BrowserPage, type Spi as BrowserPageSpi } from './BrowserPage'

export interface Spi {
  launch: (options: { baseUrl: string }) => Promise<BrowserPageSpi>
  close: () => Promise<void>
}

export class Browser {
  constructor(private spi: Spi) {}

  launch = async (options: { baseUrl: string }) => {
    const page = await this.spi.launch(options)
    return new BrowserPage(page)
  }

  close = async () => {
    await this.spi.close()
  }
}

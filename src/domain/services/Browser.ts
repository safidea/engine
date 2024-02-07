import { BrowserPage, type Spi as BrowserPageSpi } from './BrowserPage'

export interface Spi {
  launch: (options: { baseUrl: string }) => Promise<BrowserPageSpi>
  close: () => Promise<void>
}

export class Browser {
  constructor(private spi: Spi) {}

  async launch(options: { baseUrl: string }) {
    const page = await this.spi.launch(options)
    return new BrowserPage(page)
  }

  async close() {
    await this.spi.close()
  }
}

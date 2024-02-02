import { BrowserPage, type BrowserPageSpi } from './BrowserPage'

export interface BrowserSpi {
  launch: (options: { baseUrl: string }) => Promise<BrowserPageSpi>
  close: () => Promise<void>
}

export class Browser {
  constructor(private spi: BrowserSpi) {}

  async launch(options: { baseUrl: string }) {
    const page = await this.spi.launch(options)
    return new BrowserPage(page)
  }

  async close() {
    await this.spi.close()
  }
}

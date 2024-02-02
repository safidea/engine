import type { BrowserPage } from './BrowserPage'

export interface BrowserSpi {
  launch: (options: { baseUrl: string }) => Promise<BrowserPage>
  close: () => Promise<void>
}

export class Browser {
  constructor(private spi: BrowserSpi) {}

  async launch(options: { baseUrl: string }) {
    return this.spi.launch(options)
  }

  async close() {
    await this.spi.close()
  }
}

import type { BrowserElement } from './BrowserElement'

export interface BrowserPageSpi {
  open: (path: string) => Promise<void>
  title: () => Promise<string>
  getByText: (text: string, options?: { tag: string | undefined }) => Promise<BrowserElement>
  getInputByName: (name: string) => Promise<BrowserElement>
}

export class BrowserPage {
  constructor(private spi: BrowserPageSpi) {}

  async open(path: string) {
    await this.spi.open(path)
  }

  async title() {
    return this.spi.title()
  }

  async getByText(text: string, options?: { tag: string | undefined }) {
    return this.spi.getByText(text, options)
  }

  async getInputByName(name: string) {
    return this.spi.getInputByName(name)
  }
}

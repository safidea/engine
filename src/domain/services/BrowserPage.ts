import { BrowserElement, type Spi as BrowserElementSpi } from './BrowserElement'

export interface Spi {
  open: (path: string) => Promise<void>
  title: () => Promise<string>
  getByText: (
    text: string,
    options?: { tag: string | undefined }
  ) => Promise<BrowserElementSpi | undefined>
  getInputByName: (name: string) => Promise<BrowserElementSpi | undefined>
  getHtml: () => Promise<string>
}

export class BrowserPage {
  constructor(private spi: Spi) {}

  async open(path: string) {
    await this.spi.open(path)
  }

  async title() {
    return this.spi.title()
  }

  async getByText(text: string, options?: { tag: string | undefined }) {
    const element = await this.spi.getByText(text, options)
    if (element) return new BrowserElement(element)
  }

  async getInputByName(name: string) {
    const element = await this.spi.getInputByName(name)
    if (element) return new BrowserElement(element)
  }

  async getHtml() {
    return this.spi.getHtml()
  }
}

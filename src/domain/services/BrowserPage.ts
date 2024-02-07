import { BrowserElement, type Spi as BrowserElementSpi } from './BrowserElement'

export interface Spi {
  open: (path: string) => Promise<boolean>
  type: (inputName: string, value: string) => Promise<boolean>
  click: (text: string) => Promise<boolean>
  waitForText: (text: string, options: { timeout: number }) => Promise<boolean>
  getTitle: () => Promise<string>
  getByText: (
    text: string,
    options?: { tag: string | undefined }
  ) => Promise<BrowserElementSpi | undefined>
  getByAttribute: (
    attribute: string,
    value: string,
    options?: { tag: string | undefined }
  ) => Promise<BrowserElementSpi | undefined>
  getHtml: () => Promise<string>
}

export class BrowserPage {
  constructor(private spi: Spi) {}

  open = async (path: string) => {
    return this.spi.open(path)
  }

  type = async (name: string, value: string) => {
    return this.spi.type(name, value)
  }

  click = async (text: string) => {
    return this.spi.click(text)
  }

  waitForText = async (text: string, options?: { timeout?: number }) => {
    const { timeout = 5000 } = options ?? {}
    return this.spi.waitForText(text, { timeout })
  }

  getTitle = async () => {
    return this.spi.getTitle()
  }

  getByText = async (text: string, options?: { tag: string | undefined }) => {
    const element = await this.spi.getByText(text, options)
    if (element) return new BrowserElement(element)
  }

  getByAttribute = async (
    attribute: string,
    value: string,
    options?: { tag: string | undefined }
  ) => {
    const element = await this.spi.getByAttribute(attribute, value, options)
    if (element) return new BrowserElement(element)
  }

  getHtml = async () => {
    return this.spi.getHtml()
  }
}

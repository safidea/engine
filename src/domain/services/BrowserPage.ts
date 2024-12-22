import { BrowserElement, type IBrowserElementSpi } from './BrowserElement'

export interface IBrowserPageSpi {
  close: () => Promise<void>
  new: (path: string) => Promise<void>
  open: (path: string) => Promise<boolean>
  type: (inputName: string, value: string) => Promise<boolean>
  click: (text: string) => Promise<boolean>
  waitForText: (text: string, options: { timeout: number }) => Promise<boolean>
  getTitle: () => Promise<string>
  getUrl: () => Promise<string>
  getByText: (
    text: string,
    options?: { tag: string | undefined }
  ) => Promise<IBrowserElementSpi | undefined>
  getByAttribute: (
    attribute: string,
    value: string,
    options?: { tag: string | undefined }
  ) => Promise<IBrowserElementSpi | undefined>
  getHtml: () => Promise<string>
  createPdfFromHtml: (html: string) => Promise<Uint8Array>
}

export class BrowserPage {
  constructor(private _spi: IBrowserPageSpi) {}

  close = async () => {
    await this._spi.close()
  }

  new = async (path: string) => {
    return this._spi.new(path)
  }

  open = async (path: string) => {
    return this._spi.open(path)
  }

  type = async (name: string, value: string) => {
    return this._spi.type(name, value)
  }

  click = async (text: string) => {
    return this._spi.click(text)
  }

  waitForText = async (text: string, options?: { timeout?: number }) => {
    const { timeout = 5000 } = options ?? {}
    return this._spi.waitForText(text, { timeout })
  }

  getTitle = async () => {
    return this._spi.getTitle()
  }

  getUrl = async () => {
    return this._spi.getUrl()
  }

  getByText = async (text: string, options?: { tag: string | undefined }) => {
    const element = await this._spi.getByText(text, options)
    if (element) return new BrowserElement(element)
  }

  getByAttribute = async (
    attribute: string,
    value: string,
    options?: { tag: string | undefined }
  ) => {
    const element = await this._spi.getByAttribute(attribute, value, options)
    if (element) return new BrowserElement(element)
  }

  getHtml = async () => {
    return this._spi.getHtml()
  }

  createPdfFromHtml = async (html: string) => {
    return this._spi.createPdfFromHtml(html)
  }
}

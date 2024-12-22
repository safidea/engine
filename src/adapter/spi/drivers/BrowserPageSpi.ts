import type { IBrowserElementDriver } from './BrowserElementSpi'
import type { IBrowserPageSpi } from '@domain/services/BrowserPage'

export interface IBrowserPageDriver {
  close: () => Promise<void>
  new: (path: string) => Promise<void>
  open(path: string): Promise<boolean>
  type(inputName: string, value: string): Promise<boolean>
  click(text: string): Promise<boolean>
  waitForText(text: string, options: { timeout: number }): Promise<boolean>
  getTitle(): Promise<string>
  getUrl(): Promise<string>
  getByText(text: string, options?: { tag?: string }): Promise<IBrowserElementDriver | undefined>
  getByAttribute(
    attribute: string,
    value: string,
    options?: { tag?: string }
  ): Promise<IBrowserElementDriver | undefined>
  getHtml(): Promise<string>
  createPdfFromHtml: (html: string) => Promise<Uint8Array>
}

export class BrowserPageSpi implements IBrowserPageSpi {
  constructor(private _driver: IBrowserPageDriver) {}

  close = async () => {
    return this._driver.close()
  }

  new = async (path: string) => {
    return this._driver.new(path)
  }

  open = async (path: string) => {
    return this._driver.open(path)
  }

  type = async (inputName: string, value: string) => {
    return this._driver.type(inputName, value)
  }

  click = async (text: string) => {
    return this._driver.click(text)
  }

  waitForText = async (text: string, options: { timeout: number }) => {
    return this._driver.waitForText(text, options)
  }

  getTitle = async () => {
    return this._driver.getTitle()
  }

  getUrl = async () => {
    return this._driver.getUrl()
  }

  getByText = async (text: string, options?: { tag?: string }) => {
    return this._driver.getByText(text, options)
  }

  getByAttribute = async (attribute: string, value: string, options?: { tag?: string }) => {
    return this._driver.getByAttribute(attribute, value, options)
  }

  getHtml = async () => {
    return this._driver.getHtml()
  }

  createPdfFromHtml = async (html: string) => {
    return this._driver.createPdfFromHtml(html)
  }
}

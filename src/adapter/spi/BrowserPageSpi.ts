import type { Driver as BrowserElementDriver } from './BrowserElementSpi'
import type { Spi } from '@domain/services/BrowserPage'

export interface Driver {
  open(url: string): Promise<boolean>
  type(inputName: string, value: string): Promise<boolean>
  click(text: string): Promise<boolean>
  waitForText(text: string, options: { timeout: number }): Promise<boolean>
  getTitle(): Promise<string>
  getUrl(): Promise<string>
  getByText(text: string, options?: { tag?: string }): Promise<BrowserElementDriver | undefined>
  getByAttribute(
    attribute: string,
    value: string,
    options?: { tag?: string }
  ): Promise<BrowserElementDriver | undefined>
  getHtml(): Promise<string>
}

export class BrowserPageSpi implements Spi {
  constructor(private _driver: Driver) {}

  open = async (url: string) => {
    return this._driver.open(url)
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
}

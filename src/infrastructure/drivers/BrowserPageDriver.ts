import type { Driver } from '@adapter/spi/BrowserPageSpi'
import type { Page } from 'puppeteer'
import { BrowserElementDriver } from './BrowserElementDriver'

export class BrowserPageDriver implements Driver {
  constructor(
    private _page: Page,
    private _baseUrl: string
  ) {
    _page.setDefaultTimeout(5000)
  }

  open = async (path: string) => {
    try {
      const url = path.includes('http') ? path : this._baseUrl + path
      await this._page.goto(url)
      return true
    } catch (error) {
      return false
    }
  }

  type = async (inputName: string, value: string) => {
    const element = await this._page.$(`input[name="${inputName}"]`)
    if (element) {
      await element.type(value)
      return true
    }
    return false
  }

  click = async (text: string) => {
    const element = await this._page.$(`::-p-text(${text})`)
    if (element) {
      await element.click()
      return true
    }
    return false
  }

  waitForText = async (text: string, options: { timeout: number }) => {
    try {
      const { timeout } = options
      await this._page.waitForSelector(`::-p-text(${text})`, { timeout })
      return true
    } catch (error) {
      return false
    }
  }

  getTitle = async () => {
    return this._page.title()
  }

  getUrl = async () => {
    return this._page.url()
  }

  getByText = async (text: string, { tag }: { tag?: string } = {}) => {
    if (!tag) {
      const element = await this._page.$(`::-p-text(${text})`)
      if (element) {
        return new BrowserElementDriver(this._page, element)
      }
    }
    const element = await this._page.$(`::-p-xpath(//${tag}[contains(text(), '${text}')])`)
    if (element) {
      return new BrowserElementDriver(this._page, element)
    }
  }

  getByAttribute = async (attribute: string, value: string, { tag }: { tag?: string } = {}) => {
    const element = await this._page.$(`${tag ?? ''}[${attribute}="${value}"]`)
    if (element) {
      return new BrowserElementDriver(this._page, element)
    }
  }

  getHtml = async () => {
    return this._page.content()
  }
}

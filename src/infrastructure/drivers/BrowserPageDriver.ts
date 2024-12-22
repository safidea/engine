import type { IBrowserPageDriver } from '@adapter/spi/drivers/BrowserPageSpi'
import type { Page, Browser } from 'puppeteer'
import { BrowserElementDriver } from './BrowserElementDriver'

export class BrowserPageDriver implements IBrowserPageDriver {
  constructor(
    private _browser: Browser,
    private _page: Page,
    private _baseUrl?: string
  ) {
    _page.setDefaultTimeout(5000)
  }

  close = async () => {
    await this._browser.close()
  }

  new = async (baseUrl: string) => {
    await this._page.close()
    this._page = await this._browser.newPage()
    this._baseUrl = baseUrl
  }

  open = async (path: string) => {
    try {
      const url = path.includes('http') ? path : this._baseUrl + path
      await this._page.goto(url)
      return true
    } catch (error) {
      console.error(error)
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
      console.error(error)
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

  createPdfFromHtml = async (html: string) => {
    await this._page.setContent(html)
    return this._page.pdf({ format: 'A4', printBackground: true })
  }
}

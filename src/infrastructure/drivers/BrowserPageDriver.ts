import type { Driver } from '@adapter/spi/BrowserPageSpi'
import type { Page } from 'puppeteer'
import { BrowserElementDriver } from './BrowserElementDriver'

export class BrowserPageDriver implements Driver {
  constructor(
    private page: Page,
    private baseUrl: string
  ) {
    page.setDefaultTimeout(5000)
  }

  open = async (path: string) => {
    try {
      await this.page.goto(this.baseUrl + path)
      return true
    } catch (error) {
      return false
    }
  }

  type = async (inputName: string, value: string) => {
    const element = await this.page.$(`input[name="${inputName}"]`)
    if (element) {
      await element.type(value)
      return true
    }
    return false
  }

  click = async (text: string) => {
    const element = await this.page.$(`::-p-text(${text})`)
    if (element) {
      await element.click()
      return true
    }
    return false
  }

  waitForText = async (text: string, options: { timeout: number }) => {
    try {
      const { timeout } = options
      await this.page.waitForSelector(`::-p-text(${text})`, { timeout })
      return true
    } catch (error) {
      return false
    }
  }

  getTitle = async () => {
    return this.page.title()
  }

  getByText = async (text: string, { tag }: { tag?: string } = {}) => {
    if (!tag) {
      const element = await this.page.$(`::-p-text(${text})`)
      if (element) {
        return new BrowserElementDriver(this.page, element)
      }
    }
    const element = await this.page.$(`::-p-xpath(//${tag}[contains(text(), '${text}')])`)
    if (element) {
      return new BrowserElementDriver(this.page, element)
    }
  }

  getByAttribute = async (attribute: string, value: string, { tag }: { tag?: string } = {}) => {
    const element = await this.page.$(`${tag ?? ''}[${attribute}="${value}"]`)
    if (element) {
      return new BrowserElementDriver(this.page, element)
    }
  }

  getHtml = async () => {
    return this.page.content()
  }
}

import type { Driver } from '@adapter/spi/BrowserPageSpi'
import type { Page } from 'puppeteer'
import { PuppeteerBrowserElementDriver } from './PuppeteerBrowserElementDriver'

export class PuppeteerBrowserPageDriver implements Driver {
  constructor(
    private page: Page,
    private baseUrl: string
  ) {
    page.setDefaultTimeout(5000)
  }

  async open(path: string) {
    await this.page.goto(this.baseUrl + path)
  }

  async title() {
    return this.page.title()
  }

  async getByText(text: string, { tag }: { tag?: string } = {}) {
    if (!tag) {
      const element = await this.page.$(`::-p-text(${text})`)
      if (element) {
        return new PuppeteerBrowserElementDriver(this.page, element)
      }
    }
    const element = await this.page.$(`::-p-xpath(//${tag}[contains(text(), '${text}')])`)
    if (element) {
      return new PuppeteerBrowserElementDriver(this.page, element)
    }
  }

  async getInputByName(input: string) {
    const element = await this.page.$(`input[name="${input}"]`)
    if (element) {
      return new PuppeteerBrowserElementDriver(this.page, element)
    }
  }

  async getHtml() {
    return this.page.content()
  }
}

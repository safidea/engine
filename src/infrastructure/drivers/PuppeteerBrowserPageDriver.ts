import type { BrowserPageDriver } from '@adapter/spi/BrowserPageSpi'
import type { Page } from 'puppeteer'
import { PuppeteerBrowserElementDriver } from './PuppeteerBrowserElementDriver'

export class PuppeteerBrowserPageDriver implements BrowserPageDriver {
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

  async getByText(text: string, { tag = '*' }: { tag?: string } = {}) {
    const [element] = await this.page.$x(`//${tag}[contains(text(), '${text}')]`)
    if (element) {
      return new PuppeteerBrowserElementDriver(this.page, element)
    }
  }

  async getInputByName(input: string) {
    const [element] = await this.page.$x(`//input[@name='${input}']`)
    if (element) {
      return new PuppeteerBrowserElementDriver(this.page, element)
    }
  }

  async getHtml() {
    return this.page.content()
  }
}

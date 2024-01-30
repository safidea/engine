import type { IBrowserPageDriver } from '@adapter/spi/drivers/IBrowserPageDriver'
import { BrowserElementDriver } from './BrowserElementDriver'
import type { Browser, Page } from 'puppeteer'

export class BrowserPageDriver implements IBrowserPageDriver {
  constructor(
    private browser: Browser,
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
      return new BrowserElementDriver(this.page, element)
    }
    return null
  }

  async getInputByName(input: string) {
    const [element] = await this.page.$x(`//input[@name='${input}']`)
    if (element) {
      return new BrowserElementDriver(this.page, element)
    }
    return null
  }

  async close() {
    await this.browser.close()
  }
}

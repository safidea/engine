import puppeteer, { Page, Browser } from 'puppeteer'
import type { IBrowser, IBrowserPage } from '@domain/drivers/IBrowser'

class PuppeteerBrowser implements IBrowser {
  async launch() {
    const browser = await puppeteer.launch({
      headless: 'new',
    })
    const page = await browser.newPage()
    return new PuppeteerBrowserPage(browser, page)
  }
}

class PuppeteerBrowserPage implements IBrowserPage {
  constructor(
    private browser: Browser,
    private page: Page
  ) {}

  async open(url: string) {
    await this.page.goto(url)
  }

  async title() {
    return this.page.title()
  }

  async close() {
    await this.browser.close()
  }
}

export default new PuppeteerBrowser()

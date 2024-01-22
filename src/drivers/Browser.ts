import puppeteer, { Page as PuppeteerPage, Browser as PuppeteerBrowser } from 'puppeteer'
import type { IBrowser, IBrowserPage } from '@domain/drivers/IBrowser'

class Browser implements IBrowser {
  private browser: PuppeteerBrowser | undefined

  async openPage(url: string) {
    this.browser = await puppeteer.launch({
      headless: 'new',
    })
    const page = await this.browser.newPage()
    await page.goto(url)
    return new BrowserPage(page)
  }

  async close() {
    await this.browser?.close()
  }
}

class BrowserPage implements IBrowserPage {
  private page: PuppeteerPage

  constructor(page: PuppeteerPage) {
    this.page = page
  }

  async open(url: string) {
    await this.page.goto(url)
  }

  async title() {
    return this.page.title()
  }
}

export default new Browser()

import puppeteer, { Page, Browser, ElementHandle } from 'puppeteer'
import type { IBrowser, IBrowserElement, IBrowserPage } from '@domain/drivers/IBrowser'
import type { Node } from 'typescript'

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

  async getByText(text: string) {
    const element = await this.page.waitForXPath(`//*[contains(text(), '${text}')]`)
    if (element) return new PuppeteerBrowserElement(element)
    return null
  }

  async close() {
    await this.browser.close()
  }
}

class PuppeteerBrowserElement implements IBrowserElement {
  constructor(private element: ElementHandle<Node>) {}
}

export default new PuppeteerBrowser()

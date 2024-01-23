import puppeteer, { Page, Browser, ElementHandle } from 'puppeteer'
import type {
  IBrowser,
  IBrowserElement,
  IBrowserLaunchOptions,
  IBrowserPage,
} from '@domain/drivers/IBrowser'
import type { Node } from 'typescript'

export class PuppeteerBrowser implements IBrowser {
  async launch(options: IBrowserLaunchOptions) {
    const { baseUrl = '' } = options
    const browser = await puppeteer.launch({
      headless: 'new',
    })
    const page = await browser.newPage()
    return new PuppeteerBrowserPage(browser, page, baseUrl)
  }
}

class PuppeteerBrowserPage implements IBrowserPage {
  private timeout = 1000

  constructor(
    private browser: Browser,
    private page: Page,
    private baseUrl: string
  ) {}

  async open(path: string) {
    await this.page.goto(this.baseUrl + path)
  }

  async getByText(text: string) {
    const element = await this.page.waitForXPath(`//*[contains(text(), '${text}')]`, {
      timeout: this.timeout,
    })
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
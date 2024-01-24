import puppeteer, { Page, Browser, ElementHandle } from 'puppeteer'
import type {
  IBrowser,
  IBrowserElement,
  IBrowserLaunchOptions,
  IBrowserPage,
} from '@domain/drivers/IBrowser'
import type { Node } from 'typescript'
import type { ILogger } from '@domain/drivers/ILogger'

export class PuppeteerBrowser implements IBrowser {
  constructor(private logger: ILogger) {}

  async launch(options: IBrowserLaunchOptions) {
    const browser = await puppeteer.launch({
      headless: 'new',
    })
    const page = await browser.newPage()
    const log = this.logger.init('browser:' + options.logName)
    const baseUrl = options.baseUrl.replace(/\/$/, '')
    return new PuppeteerBrowserPage(browser, page, log, baseUrl)
  }
}

class PuppeteerBrowserPage implements IBrowserPage {
  constructor(
    private browser: Browser,
    private page: Page,
    private log: (message: string) => void,
    private baseUrl: string
  ) {
    page.setDefaultTimeout(5000)
  }

  async open(path: string) {
    this.log(`open ${path}`)
    await this.page.goto(this.baseUrl + path)
  }

  async getByText(text: string) {
    this.log(`getByText ${text}`)
    const [element] = await this.page.$x(`//*[contains(text(), '${text}')]`)
    if (element) {
      return new PuppeteerBrowserElement(element)
    }
    return null
  }

  async close() {
    this.log('close')
    await this.browser.close()
  }
}

class PuppeteerBrowserElement implements IBrowserElement {
  constructor(private element: ElementHandle<Node>) {}
}

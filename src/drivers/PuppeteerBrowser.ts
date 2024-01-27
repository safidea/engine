import puppeteer, { Page, Browser, ElementHandle } from 'puppeteer'
import type {
  IBrowser,
  IBrowserElement,
  IBrowserLaunchOptions,
  IBrowserPage,
} from '@domain/drivers/IBrowser'

export class PuppeteerBrowser implements IBrowser {
  constructor() {}

  async launch({ baseUrl = '' }: IBrowserLaunchOptions) {
    const browser = await puppeteer.launch({
      headless: false,
    })
    const page = await browser.newPage()
    return new PuppeteerBrowserPage(browser, page, baseUrl)
  }
}

class PuppeteerBrowserPage implements IBrowserPage {
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
      return new PuppeteerBrowserElement(this.page, element)
    }
    return null
  }

  async getInputByName(input: string) {
    const [element] = await this.page.$x(`//input[@name='${input}']`)
    if (element) {
      return new PuppeteerBrowserElement(this.page, element)
    }
    return null
  }

  async close() {
    await this.browser.close()
  }
}

class PuppeteerBrowserElement implements IBrowserElement {
  constructor(
    private page: Page,
    private element: ElementHandle<globalThis.Node>
  ) {}

  getAttribute(attribute: string) {
    return this.page.evaluate(
      (el, attr) => (el as HTMLElement).getAttribute(attr) ?? undefined,
      this.element,
      attribute
    )
  }

  getValue() {
    return this.page.evaluate(
      (el) => (el as HTMLInputElement).value ?? undefined,
      this.element,
    )
  }

  type(value: string) {
    return this.element.type(value)
  }
}

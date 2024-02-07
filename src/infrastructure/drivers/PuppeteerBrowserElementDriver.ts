import type { Driver } from '@adapter/spi/BrowserElementSpi'
import type { ElementHandle, Page } from 'puppeteer'

export class PuppeteerBrowserElementDriver implements Driver {
  constructor(
    private page: Page,
    private element: ElementHandle<globalThis.Node>
  ) {}

  async getAttribute(attribute: string) {
    return this.page.evaluate(
      (el, attr) => (el as HTMLElement).getAttribute(attr) ?? undefined,
      this.element,
      attribute
    )
  }

  async getValue() {
    return this.page.evaluate((el) => (el as HTMLInputElement).value ?? undefined, this.element)
  }

  async type(value: string) {
    await this.element.type(value)
  }
}

import type { BrowserElementDriver } from '@adapter/spi/BrowserElementSpi'
import type { ElementHandle, Page } from 'puppeteer'

export class PuppeteerBrowserElementDriver implements BrowserElementDriver {
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
    return this.page.evaluate((el) => (el as HTMLInputElement).value ?? undefined, this.element)
  }

  type(value: string) {
    return this.element.type(value)
  }
}

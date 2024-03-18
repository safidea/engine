import type { Driver } from '@adapter/spi/BrowserElementSpi'
import type { ElementHandle, Page } from 'puppeteer'

export class BrowserElementDriver implements Driver {
  constructor(
    private page: Page,
    private element: ElementHandle<globalThis.Node>
  ) {}

  getAttribute = async (attribute: string) => {
    return this.page.evaluate(
      (el, attr) => (el as HTMLElement).getAttribute(attr) ?? undefined,
      this.element,
      attribute
    )
  }

  getInputValue = async () => {
    return this.page.evaluate((el) => (el as HTMLInputElement).value ?? undefined, this.element)
  }
}

import type { BrowserLaunchOptionsDto } from '@adapter/spi/dtos/BrowserLaunchOptionsDto'
import type { BrowserDriver } from '@adapter/spi/BrowserSpi'
import puppeteer, { Browser } from 'puppeteer'
import { PuppeteerBrowserPageDriver } from './PuppeteerBrowserPageDriver'

export class PuppeteerBrowserDriver implements BrowserDriver {
  browser?: Browser

  constructor() {}

  async launch({ baseUrl = '' }: BrowserLaunchOptionsDto) {
    this.browser = await puppeteer.launch({
      headless: 'new',
    })
    const page = await this.browser.newPage()
    return new PuppeteerBrowserPageDriver(page, baseUrl)
  }

  async close() {
    await this.browser?.close()
  }
}

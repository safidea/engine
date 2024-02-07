import type { BrowserLaunchOptionsDto } from '@adapter/spi/dtos/BrowserLaunchOptionsDto'
import type { Driver } from '@adapter/spi/BrowserSpi'
import puppeteer, { Browser } from 'puppeteer'
import { PuppeteerBrowserPageDriver } from './PuppeteerBrowserPageDriver'

export class PuppeteerBrowserDriver implements Driver {
  browser?: Browser

  constructor() {}

  async launch({ baseUrl = '' }: BrowserLaunchOptionsDto) {
    this.browser = await puppeteer.launch()
    const page = await this.browser.newPage()
    return new PuppeteerBrowserPageDriver(page, baseUrl)
  }

  async close() {
    await this.browser?.close()
  }
}

import type { BrowserLaunchOptionsDto } from '@adapter/spi/dtos/BrowserLaunchOptionsDto'
import type { Driver } from '@adapter/spi/BrowserSpi'
import puppeteer, { Browser } from 'puppeteer'
import { PuppeteerBrowserPageDriver } from './PuppeteerBrowserPageDriver'

export class PuppeteerBrowserDriver implements Driver {
  browser?: Browser

  constructor() {}

  launch = async ({ baseUrl = '' }: BrowserLaunchOptionsDto) => {
    this.browser = await puppeteer.launch()
    const page = await this.browser.newPage()
    return new PuppeteerBrowserPageDriver(page, baseUrl)
  }

  close = async () => {
    await this.browser?.close()
  }
}

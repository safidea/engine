import type { BrowserLaunchOptionsDto } from '@adapter/spi/dtos/BrowserLaunchOptionsDto'
import type { Driver } from '@adapter/spi/BrowserSpi'
import puppeteer, { Browser as PuppeteerBrowser } from 'puppeteer'
import { BrowserPageDriver } from './BrowserPageDriver'

export class BrowserDriver implements Driver {
  browser?: PuppeteerBrowser

  constructor() {}

  launch = async ({ baseUrl = '' }: BrowserLaunchOptionsDto) => {
    this.browser = await puppeteer.launch()
    const page = await this.browser.newPage()
    return new BrowserPageDriver(page, baseUrl)
  }

  close = async () => {
    await this.browser?.close()
  }
}

import type { BrowserLaunchOptionsDto } from '@adapter/spi/dtos/BrowserLaunchOptionsDto'
import type { BrowserDriver } from '@adapter/spi/BrowserSPI'
import puppeteer from 'puppeteer'
import { PuppeteerBrowserPageDriver } from './PuppeteerBrowserPageDriver'

export class PuppeteerBrowserDriver implements BrowserDriver {
  constructor() {}

  async launch({ baseUrl = '' }: BrowserLaunchOptionsDto) {
    const browser = await puppeteer.launch({
      headless: 'new',
    })
    const page = await browser.newPage()
    return new PuppeteerBrowserPageDriver(browser, page, baseUrl)
  }
}

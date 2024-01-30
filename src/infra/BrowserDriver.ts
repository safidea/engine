import type { IBrowserDriver } from '@adapter/spi/drivers/IBrowserDriver'
import type { BrowserLaunchOptionsDto } from '@adapter/spi/dtos/BrowserLaunchOptionsDto'
import { BrowserPageDriver } from './BrowserPageDriver'
import puppeteer from 'puppeteer'

export class BrowserDriver implements IBrowserDriver {
  constructor() {}

  async launch({ baseUrl = '' }: BrowserLaunchOptionsDto) {
    const browser = await puppeteer.launch({
      headless: 'new',
    })
    const page = await browser.newPage()
    return new BrowserPageDriver(browser, page, baseUrl)
  }
}

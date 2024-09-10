import type { Driver } from '@adapter/spi/BrowserSpi'
import puppeteer from 'puppeteer'
import { BrowserPageDriver } from './BrowserPageDriver'

export class BrowserDriver implements Driver {
  launch = async (baseUrl?: string) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    return new BrowserPageDriver(browser, page, baseUrl)
  }
}

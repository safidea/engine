import type { Driver } from '@adapter/spi/BrowserSpi'
import puppeteer, { Browser as PuppeteerBrowser } from 'puppeteer'
import { BrowserPageDriver } from './BrowserPageDriver'

export class BrowserDriver implements Driver {
  private browsers: { id: string; browser: PuppeteerBrowser }[] = []

  private getBrowser = (id: string) => {
    const browser = this.browsers.find((b) => b.id === id)?.browser
    if (!browser) {
      throw new Error(`Browser with id ${id} not found`)
    }
    return browser
  }

  launch = async (id: string) => {
    const browser = await puppeteer.launch()
    this.browsers.push({ id, browser })
  }

  newPage = async (id: string, baseUrl: string) => {
    const browser = this.getBrowser(id)
    const page = await browser.newPage()
    return new BrowserPageDriver(page, baseUrl)
  }

  close = async (id: string) => {
    const browser = this.getBrowser(id)
    await browser.close()
  }
}

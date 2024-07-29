import type { Driver } from '@adapter/spi/BrowserSpi'
import puppeteer, { Browser as PuppeteerBrowser } from 'puppeteer'
import { BrowserPageDriver } from './BrowserPageDriver'

export class BrowserDriver implements Driver {
  private _browsers: { id: string; browser: PuppeteerBrowser }[] = []

  launch = async (id: string) => {
    const browser = await puppeteer.launch()
    this._browsers.push({ id, browser })
  }

  newPage = async (id: string, baseUrl: string) => {
    const browser = this._getBrowser(id)
    const page = await browser.newPage()
    return new BrowserPageDriver(page, baseUrl)
  }

  close = async (id: string) => {
    const browser = this._getBrowser(id)
    await browser.close()
  }

  private _getBrowser = (id: string) => {
    const browser = this._browsers.find((b) => b.id === id)?.browser
    if (!browser) {
      throw new Error(`Browser with id ${id} not found`)
    }
    return browser
  }
}

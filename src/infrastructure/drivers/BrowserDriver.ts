import type { Driver } from '@adapter/spi/BrowserSpi'
import puppeteer, { Browser as PuppeteerBrowser } from 'puppeteer'
import { BrowserPageDriver } from './BrowserPageDriver'

export class BrowserDriver implements Driver {
  private _browser?: PuppeteerBrowser

  launch = async () => {
    this._browser = await puppeteer.launch()
  }

  newPage = async (baseUrl: string) => {
    if (!this._browser) throw new Error('Browser not launched')
    const page = await this._browser.newPage()
    return new BrowserPageDriver(page, baseUrl)
  }

  close = async () => {
    await this._browser?.close()
  }
}

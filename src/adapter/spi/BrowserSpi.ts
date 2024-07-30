import type { Spi } from '@domain/services/Browser'
import type { Driver as BrowserPageDriver } from './BrowserPageSpi'

export interface Driver {
  launch: () => Promise<void>
  newPage: (baseUrl: string) => Promise<BrowserPageDriver>
  close: () => Promise<void>
}

export class BrowserSpi implements Spi {
  constructor(private _driver: Driver) {}

  launch = async () => {
    return this._driver.launch()
  }

  newPage = async (baseUrl: string) => {
    return this._driver.newPage(baseUrl)
  }

  close = async () => {
    return this._driver.close()
  }
}

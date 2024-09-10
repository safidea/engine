import type { Spi } from '@domain/services/Browser'
import type { Driver as BrowserPageDriver } from './BrowserPageSpi'

export interface Driver {
  launch: (baseUrl?: string) => Promise<BrowserPageDriver>
}

export class BrowserSpi implements Spi {
  constructor(private _driver: Driver) {}

  launch = async (baseUrl?: string) => {
    return this._driver.launch(baseUrl)
  }
}

import type { Spi } from '@domain/services/Browser'
import type { Driver as BrowserPageDriver } from './BrowserPageSpi'

export interface Driver {
  launch: (id: string) => Promise<void>
  newPage: (id: string, baseUrl: string) => Promise<BrowserPageDriver>
  close: (id: string) => Promise<void>
}

export class BrowserSpi implements Spi {
  constructor(private _driver: Driver) {}

  launch = async (id: string) => {
    return this._driver.launch(id)
  }

  newPage = async (id: string, baseUrl: string) => {
    return this._driver.newPage(id, baseUrl)
  }

  close = async (id: string) => {
    return this._driver.close(id)
  }
}

import type { IBrowserSpi } from '@domain/services/Browser'
import type { IBrowserPageDriver } from './BrowserPageSpi'

export interface IBrowserDriver {
  launch: (baseUrl?: string) => Promise<IBrowserPageDriver>
}

export class BrowserSpi implements IBrowserSpi {
  constructor(private _driver: IBrowserDriver) {}

  launch = async (baseUrl?: string) => {
    return this._driver.launch(baseUrl)
  }
}

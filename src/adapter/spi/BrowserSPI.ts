import type { Driver as BrowserPageDriver } from './BrowserPageSpi'

export interface Driver {
  launch: (baseUrl: string) => Promise<BrowserPageDriver>
  close: () => Promise<void>
}

export class BrowserSpi {
  constructor(private driver: Driver) {}

  launch = async (baseUrl: string) => {
    return this.driver.launch(baseUrl)
  }

  close = async () => {
    return this.driver.close()
  }
}

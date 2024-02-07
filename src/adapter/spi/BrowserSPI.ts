import type { Driver as BrowserPageDriver } from './BrowserPageSpi'
import type { BrowserLaunchOptionsDto } from './dtos/BrowserLaunchOptionsDto'

export interface Driver {
  launch(options?: BrowserLaunchOptionsDto): Promise<BrowserPageDriver>
  close(): Promise<void>
}

export class BrowserSpi {
  constructor(private driver: Driver) {}

  launch = async (options: BrowserLaunchOptionsDto) => {
    return this.driver.launch(options)
  }

  close = async () => {
    return this.driver.close()
  }
}

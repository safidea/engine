import type { BrowserPageDriver } from './BrowserPageSpi'
import type { BrowserLaunchOptionsDto } from './dtos/BrowserLaunchOptionsDto'

export interface BrowserDriver {
  launch(options?: BrowserLaunchOptionsDto): Promise<BrowserPageDriver>
  close(): Promise<void>
}

export class BrowserSpi {
  constructor(private driver: BrowserDriver) {}

  async launch(options: BrowserLaunchOptionsDto) {
    return this.driver.launch(options)
  }

  async close() {
    return this.driver.close()
  }
}

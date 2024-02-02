import type { BrowserPageDriver } from './BrowserPageSpi'
import type { BrowserLaunchOptionsDto } from './dtos/BrowserLaunchOptionsDto'

export interface BrowserDriver {
  launch(options?: BrowserLaunchOptionsDto): Promise<BrowserPageDriver>
}

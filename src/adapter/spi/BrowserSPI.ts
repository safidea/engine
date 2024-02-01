import type { BrowserPageDriver } from './BrowserPageSPI'
import type { BrowserLaunchOptionsDto } from './dtos/BrowserLaunchOptionsDto'

export interface BrowserDriver {
  launch(options?: BrowserLaunchOptionsDto): Promise<BrowserPageDriver>
}

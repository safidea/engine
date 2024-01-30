import type { BrowserLaunchOptionsDto } from '../dtos/BrowserLaunchOptionsDto'
import type { IBrowserPageDriver } from './IBrowserPageDriver'

export interface IBrowserDriver {
  launch(options?: BrowserLaunchOptionsDto): Promise<IBrowserPageDriver>
}

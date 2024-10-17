import type { App } from '@domain/entities/App'
import type { BrowserPage } from '@domain/services/BrowserPage'

export interface Base {
  execute(app: App, page: BrowserPage): Promise<void | object>
}

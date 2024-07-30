import type { App } from '@domain/entities/App'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { Logger } from '@domain/services/Logger'

export interface BaseParams {
  logger: Logger
}

export interface Base {
  execute(app: App, page: BrowserPage): Promise<void>
}

import type { BrowserPage } from '@domain/services/BrowserPage'
import type { Logger } from '@domain/services/Logger'
import type { App } from '../App'

export interface BaseServices {
  logger: Logger
}

export interface Base {
  execute: (app: App, page: BrowserPage, context?: object) => Promise<void>
}

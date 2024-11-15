import type { BrowserPage } from '@domain/services/BrowserPage'
import type { App } from '../App'

export interface BaseExpect {
  execute: (app: App, page: BrowserPage, context?: object) => Promise<void>
}

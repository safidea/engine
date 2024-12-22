import type { BrowserPage } from '@domain/services/BrowserPage'
import type { StartedApp } from '../App/Started'

export interface BaseExpect {
  execute: (app: StartedApp, page: BrowserPage, context?: object) => Promise<void>
}

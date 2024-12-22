import type { StartedApp } from '@domain/entities/App/Started'
import type { BrowserPage } from '@domain/services/BrowserPage'

export interface BaseEvent {
  execute(app: StartedApp, page: BrowserPage): Promise<void | object>
}

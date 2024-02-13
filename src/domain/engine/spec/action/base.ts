import type { App } from '@domain/engine/App'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { Logger } from '@domain/services/Logger'

export interface BaseParams {
  logger: Logger
  feature: string
  spec: string
}

export class BaseWithApp {
  executeWithApp = async (_app: App) => {}
}

export class BaseWithRequest {
  executeWithRequest = async (_baseUrl: string) => {}
}

export class BaseWithPage {
  executeWithPage = async (_page: BrowserPage) => {}
}

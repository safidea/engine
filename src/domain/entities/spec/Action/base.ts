import type { BrowserPage } from '@domain/services/BrowserPage'
import type { Logger } from '@domain/services/Logger'

export interface BaseParams {
  logger: Logger
  feature: string
  spec: string
  baseUrl: string
}

export class Base {
  execute = async () => {}
}

export class BaseWithPage {
  executeWithPage = async (_page: BrowserPage) => {}
}

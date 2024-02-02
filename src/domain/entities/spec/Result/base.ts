import type { BrowserPage } from '@domain/services/BrowserPage'
import type { Database } from '@domain/services/Database'
import type { Logger } from '@domain/services/Logger'

export interface BaseParams {
  logger: Logger
  feature: string
  spec: string
}

export class BaseWithDatabase {
  executeWithDatabase = async (_database: Database) => {}
}

export class BaseWithPage {
  executeWithPage = async (_page: BrowserPage) => {}
}

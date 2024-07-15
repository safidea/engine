import type { BrowserPage } from '@domain/services/BrowserPage'
import type { Database } from '@domain/services/Database'
import type { Logger } from '@domain/services/Logger'
import type { Mailer } from '@domain/services/Mailer'

export interface BaseParams {
  logger: Logger
  spec: string
}

export class BaseWithDatabase {
  executeWithDatabase = async (_database: Database) => {}
}

export class BaseWithPage {
  executeWithPage = async (_page: BrowserPage) => {}
}

export class BaseWithMailer {
  constructor(public mailbox: string) {}
  executeWithMailer = async (_mailer: Mailer) => {}
}

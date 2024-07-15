import type { App } from '@domain/engine/App'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { Logger } from '@domain/services/Logger'
import type { Mailer } from '@domain/services/Mailer'

export interface BaseParams {
  logger: Logger
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

export class BaseWithPageAndMailer {
  executeWithPageAndMailer = async (_page: BrowserPage, _mailer: Mailer) => {}
}

import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base, type BaseServices } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

export interface Config {
  title: string
}

export type Services = BaseServices

export class Title implements Base {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  execute = async (_app: App, page: BrowserPage) => {
    const { title } = this._config
    const { logger } = this._services
    logger.debug(`checking if page title is "${title}"`)
    const pageTitle = await page.getTitle()
    if (pageTitle !== title) {
      throw new TestError({
        code: 'INVALID_TITLE',
        expected: title,
        received: pageTitle,
      })
    }
  }
}

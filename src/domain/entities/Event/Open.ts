import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base, type BaseServices } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

export interface Config {
  url: string
}

export type Services = BaseServices

export class Open implements Base {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  execute = async (_app: App, page: BrowserPage) => {
    const { url } = this._config
    const { logger } = this._services
    logger.debug(`opening url "${url}"`)
    const success = await page.open(url)
    if (!success) {
      throw new TestError({
        code: 'PAGE_NOT_FOUND',
        expected: url,
      })
    }
  }
}

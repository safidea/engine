import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base, type BaseServices } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

export interface Config {
  text: string
  timeout?: number
}

export type Services = BaseServices

export class WaitForText implements Base {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  execute = async (_app: App, page: BrowserPage) => {
    const { text, timeout } = this._config
    const { logger } = this._services
    logger.debug(`waiting for text "${text}"`)
    const success = await page.waitForText(text, { timeout })
    if (!success) {
      throw new TestError({
        code: 'TEXT_NOT_FOUND',
        expected: text,
      })
    }
  }
}

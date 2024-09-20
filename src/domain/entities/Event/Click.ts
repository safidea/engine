import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base, type BaseServices } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

export interface Config {
  text: string
}

export type Services = BaseServices

export class Click implements Base {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  execute = async (_app: App, page: BrowserPage) => {
    const { text } = this._config
    const { logger } = this._services
    logger.debug(`clicking on text "${text}"`)
    const success = await page.click(text)
    if (!success) {
      throw new TestError({
        code: 'BUTTON_NOT_FOUND',
        expected: text,
      })
    }
  }
}

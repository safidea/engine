import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base, type BaseServices } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

export interface Config {
  input: string
  value: string
}

export type Services = BaseServices

export class Fill implements Base {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  execute = async (_app: App, page: BrowserPage) => {
    const { input, value } = this._config
    const { logger } = this._services
    logger.debug(`typing "${value}" in input "${input}"`)
    const success = await page.type(input, value)
    if (!success) {
      throw new TestError({
        code: 'INPUT_NOT_FOUND',
        expected: value,
        received: '',
      })
    }
  }
}

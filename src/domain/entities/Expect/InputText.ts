import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base, type BaseServices } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

export interface Config {
  input: string
  value: string
}

export type Services = BaseServices

export class InputText implements Base {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  execute = async (_app: App, page: BrowserPage, _context?: object) => {
    const { input, value } = this._config
    const { logger } = this._services
    logger.debug(`checking if input "${input}" with value "${value}" exist`)
    const inputElement = await page.getByAttribute('name', input, { tag: 'input' })
    const attributeValue = await inputElement?.getInputValue()
    if (attributeValue !== value) {
      throw new TestError({
        code: 'INPUT_NOT_FOUND',
        expected: value,
        received: attributeValue,
      })
    }
  }
}

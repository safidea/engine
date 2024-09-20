import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base, type BaseServices } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

export interface Config {
  attribute: string
  value: string
  tag?: keyof HTMLElementTagNameMap
}

export type Services = BaseServices

export class Attribute implements Base {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  execute = async (_app: App, page: BrowserPage) => {
    const { tag, attribute, value } = this._config
    const { logger } = this._services
    const attributeMessage = `checking if attribute "${attribute}" with value "${value}" exist`
    logger.debug(tag ? `${attributeMessage} in tag "${tag}"` : attributeMessage)
    const element = await page.getByAttribute(attribute, value, { tag })
    if (!element) {
      throw new TestError({
        code: 'ATTRIBUTE_NOT_FOUND',
        expected: value,
      })
    }
  }
}

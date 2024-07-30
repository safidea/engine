import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

interface Params extends BaseParams {
  attribute: string
  value: string
  tag?: keyof HTMLElementTagNameMap
}

export class Attribute implements Base {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    const { logger } = _params
    this._log = logger.init('expect:attribute')
  }

  execute = async (_app: App, page: BrowserPage) => {
    const { tag, attribute, value } = this._params
    const attributeMessage = `checking if attribute "${attribute}" with value "${value}" exist`
    this._log(tag ? `${attributeMessage} in tag "${tag}"` : attributeMessage)
    const element = await page.getByAttribute(attribute, value, { tag })
    if (!element) {
      throw new TestError({
        code: 'ATTRIBUTE_NOT_FOUND',
        expected: value,
      })
    }
  }
}

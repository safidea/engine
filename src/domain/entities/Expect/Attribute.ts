import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'

interface Params extends BaseParams {
  attribute: string
  value: string
  tag?: keyof HTMLElementTagNameMap
}

export class Attribute extends BaseWithPage {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    super()
    const { logger } = _params
    this._log = logger.init('expect:attribute')
  }

  executeWithPage = async (page: BrowserPage) => {
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

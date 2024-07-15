import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { TestError } from '@domain/entities/error/Test'

interface Params extends BaseParams {
  attribute: string
  value: string
  tag?: keyof HTMLElementTagNameMap
}

export class Attribute extends BaseWithPage {
  constructor(private params: Params) {
    super()
  }

  executeWithPage = async (page: BrowserPage) => {
    const { tag, attribute, value, logger, spec } = this.params
    const attributeMessage = `checking if attribute "${attribute}" with value "${value}" exist`
    logger.log(tag ? `${attributeMessage} in tag "${tag}"` : attributeMessage)
    const element = await page.getByAttribute(attribute, value, { tag })
    if (!element) {
      throw new TestError({
        code: 'ATTRIBUTE_NOT_FOUND',
        spec,
        expected: value,
      })
    }
  }
}

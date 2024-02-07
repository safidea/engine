import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { SpecError } from '../SpecError'

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
    const { tag, attribute, value, logger, feature, spec } = this.params
    const attributeMessage = `checking if attribute "${attribute}" with value "${value}" exist`
    logger.log(tag ? `${attributeMessage} in tag "${tag}"` : attributeMessage)
    const element = await page.getByAttribute(attribute, value, { tag })
    if (!element) {
      throw new SpecError('ATTRIBUTE_NOT_FOUND', {
        feature,
        spec,
        expected: value,
        tag,
      })
    }
  }
}

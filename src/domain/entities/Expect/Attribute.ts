import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'

interface Params extends BaseParams {
  attribute: string
  value: string
  tag?: keyof HTMLElementTagNameMap
}

export class Attribute extends BaseWithPage {
  private log: (message: string) => void

  constructor(private params: Params) {
    super()
    const { logger } = params
    this.log = logger.init('expect:attribute')
  }

  executeWithPage = async (page: BrowserPage) => {
    const { tag, attribute, value } = this.params
    const attributeMessage = `checking if attribute "${attribute}" with value "${value}" exist`
    this.log(tag ? `${attributeMessage} in tag "${tag}"` : attributeMessage)
    const element = await page.getByAttribute(attribute, value, { tag })
    if (!element) {
      throw new TestError({
        code: 'ATTRIBUTE_NOT_FOUND',
        expected: value,
      })
    }
  }
}

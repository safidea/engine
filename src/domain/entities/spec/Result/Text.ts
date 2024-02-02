import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { SpecError } from '../SpecError'

export interface TextConfig {
  text: string
  tag?: keyof HTMLElementTagNameMap
  attribute?: undefined
  value?: undefined
}

export class Text extends BaseWithPage {
  constructor(
    private config: TextConfig,
    private params: BaseParams
  ) {
    super()
  }

  executeWithPage = async (page: BrowserPage) => {
    const { tag, text, attribute, value } = this.config
    const { logger, feature, spec } = this.params
    if (attribute) {
      const attributeMessage = `checking if attribute "${attribute}" has value "${value}" in text "${text}"`
      logger.log(tag ? `${attributeMessage} with tag "${tag}"` : attributeMessage)
    } else {
      const textMessage = `checking if text "${text}" exist`
      logger.log(tag ? `${textMessage} with tag "${tag}"` : textMessage)
    }
    const textElement = await page.getByText(text, { tag })
    if (attribute && textElement) {
      const attributeValue = await textElement.getAttribute(attribute)
      if (attributeValue !== value) {
        throw new SpecError('ATTRIBUTE_NOT_FOUND', {
          feature,
          spec,
          expected: value,
          received: attributeValue,
          tag,
        })
      }
    } else if (!textElement) {
      throw new SpecError('TEXT_NOT_FOUND', {
        feature,
        spec,
        expected: text,
        received: '',
        tag,
      })
    }
  }
}

import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { TestError } from '@domain/entities/error/Test'

interface Params extends BaseParams {
  text: string
  tag?: keyof HTMLElementTagNameMap
}

export class Text extends BaseWithPage {
  constructor(private params: Params) {
    super()
  }

  executeWithPage = async (page: BrowserPage) => {
    const { tag, text, logger, spec } = this.params
    const textMessage = `checking if text "${text}" exist`
    logger.log(tag ? `${textMessage} in tag "${tag}"` : textMessage)
    const textElement = await page.getByText(text, { tag })
    if (!textElement) {
      throw new TestError({
        code: 'TEXT_NOT_FOUND',
        spec,
        expected: text,
      })
    }
  }
}

import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'

interface Params extends BaseParams {
  text: string
  tag?: keyof HTMLElementTagNameMap
}

export class Text extends BaseWithPage {
  private log: (message: string) => void

  constructor(private params: Params) {
    super()
    const { logger } = params
    this.log = logger.init('expect:text')
  }

  executeWithPage = async (page: BrowserPage) => {
    const { tag, text } = this.params
    const textMessage = `checking if text "${text}" exist`
    this.log(tag ? `${textMessage} in tag "${tag}"` : textMessage)
    const textElement = await page.getByText(text, { tag })
    if (!textElement) {
      throw new TestError({
        code: 'TEXT_NOT_FOUND',
        expected: text,
      })
    }
  }
}

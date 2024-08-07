import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

interface Params extends BaseParams {
  text: string
  tag?: keyof HTMLElementTagNameMap
}

export class Text implements Base {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    const { logger } = _params
    this._log = logger.init('expect:text')
  }

  execute = async (_app: App, page: BrowserPage) => {
    const { tag, text } = this._params
    const textMessage = `checking if text "${text}" exist`
    this._log(tag ? `${textMessage} in tag "${tag}"` : textMessage)
    const textElement = await page.getByText(text, { tag })
    if (!textElement) {
      throw new TestError({
        code: 'TEXT_NOT_FOUND',
        expected: text,
      })
    }
  }
}

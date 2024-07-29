import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'

interface Params extends BaseParams {
  title: string
}

export class Title extends BaseWithPage {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    super()
    const { logger } = _params
    this._log = logger.init('expect:title')
  }

  executeWithPage = async (page: BrowserPage) => {
    const { title } = this._params
    this._log(`checking if page title is "${title}"`)
    const pageTitle = await page.getTitle()
    if (pageTitle !== title) {
      throw new TestError({
        code: 'INVALID_TITLE',
        expected: title,
        received: pageTitle,
      })
    }
  }
}

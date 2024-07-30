import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

interface Params extends BaseParams {
  title: string
}

export class Title implements Base {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    const { logger } = _params
    this._log = logger.init('expect:title')
  }

  execute = async (_app: App, page: BrowserPage) => {
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

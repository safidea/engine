import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

interface Params extends BaseParams {
  url: string
}

export class Open implements Base {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    const { logger } = _params
    this._log = logger.init('event:open')
  }

  execute = async (_app: App, page: BrowserPage) => {
    const { url } = this._params
    this._log(`opening url "${url}"`)
    const success = await page.open(url)
    if (!success) {
      throw new TestError({
        code: 'PAGE_NOT_FOUND',
        expected: url,
      })
    }
  }
}

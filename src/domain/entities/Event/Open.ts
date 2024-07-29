import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'

interface Params extends BaseParams {
  url: string
}

export class Open extends BaseWithPage {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    super()
    const { logger } = _params
    this._log = logger.init('event:open')
  }

  executeWithPage = async (page: BrowserPage) => {
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

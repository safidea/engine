import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'

interface Params extends BaseParams {
  text: string
}

export class Click extends BaseWithPage {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    super()
    const { logger } = _params
    this._log = logger.init('event:click')
  }

  executeWithPage = async (page: BrowserPage) => {
    const { text } = this._params
    this._log(`clicking on text "${text}"`)
    const success = await page.click(text)
    if (!success) {
      throw new TestError({
        code: 'BUTTON_NOT_FOUND',
        expected: text,
      })
    }
  }
}

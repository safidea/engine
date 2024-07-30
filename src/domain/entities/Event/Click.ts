import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

interface Params extends BaseParams {
  text: string
}

export class Click implements Base {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    const { logger } = _params
    this._log = logger.init('event:click')
  }

  execute = async (_app: App, page: BrowserPage) => {
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

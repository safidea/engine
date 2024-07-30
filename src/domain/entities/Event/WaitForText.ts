import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

interface Params extends BaseParams {
  text: string
  timeout?: number
}

export class WaitForText implements Base {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    const { logger } = _params
    this._log = logger.init('event:wait-for-text')
  }

  execute = async (_app: App, page: BrowserPage) => {
    const { text, timeout } = this._params
    this._log(`waiting for text "${text}"`)
    const success = await page.waitForText(text, { timeout })
    if (!success) {
      throw new TestError({
        code: 'TEXT_NOT_FOUND',
        expected: text,
      })
    }
  }
}

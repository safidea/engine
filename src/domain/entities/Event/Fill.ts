import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

interface Params extends BaseParams {
  input: string
  value: string
}

export class Fill implements Base {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    const { logger } = _params
    this._log = logger.init('event:fill')
  }

  execute = async (_app: App, page: BrowserPage) => {
    const { input, value } = this._params
    this._log(`typing "${value}" in input "${input}"`)
    const success = await page.type(input, value)
    if (!success) {
      throw new TestError({
        code: 'INPUT_NOT_FOUND',
        expected: value,
        received: '',
      })
    }
  }
}

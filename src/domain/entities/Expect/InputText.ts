import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

interface Params extends BaseParams {
  input: string
  value: string
}

export class InputText implements Base {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    const { logger } = _params
    this._log = logger.init('expect:input-text')
  }

  execute = async (_app: App, page: BrowserPage) => {
    const { input, value } = this._params
    this._log(`checking if input "${input}" with value "${value}" exist`)
    const inputElement = await page.getByAttribute('name', input, { tag: 'input' })
    const attributeValue = await inputElement?.getInputValue()
    if (attributeValue !== value) {
      throw new TestError({
        code: 'INPUT_NOT_FOUND',
        expected: value,
        received: attributeValue,
      })
    }
  }
}

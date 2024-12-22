import type { BrowserPage } from '@domain/services/BrowserPage'
import { type BaseExpect } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { StartedApp } from '../App/Started'

export interface InputTextExpectConfig {
  input: string
  value: string
}

export class InputTextExpect implements BaseExpect {
  constructor(private _config: InputTextExpectConfig) {}

  execute = async (_app: StartedApp, page: BrowserPage, _context?: object) => {
    const { input, value } = this._config
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

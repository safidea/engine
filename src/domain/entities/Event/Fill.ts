import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

export interface Config {
  input: string
  value: string
}

export class Fill implements Base {
  constructor(private _config: Config) {}

  execute = async (_app: App, page: BrowserPage) => {
    const { input, value } = this._config
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

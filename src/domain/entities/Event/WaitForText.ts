import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

export interface Config {
  text: string
  timeout?: number
}

export class WaitForText implements Base {
  constructor(private _config: Config) {}

  execute = async (_app: App, page: BrowserPage) => {
    const { text, timeout } = this._config
    const success = await page.waitForText(text, { timeout })
    if (!success) {
      throw new TestError({
        code: 'TEXT_NOT_FOUND',
        expected: text,
      })
    }
  }
}

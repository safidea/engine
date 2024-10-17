import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

export interface Config {
  url: string
}

export class Open implements Base {
  constructor(private _config: Config) {}

  execute = async (_app: App, page: BrowserPage) => {
    const { url } = this._config
    const success = await page.open(url)
    if (!success) {
      throw new TestError({
        code: 'PAGE_NOT_FOUND',
        expected: url,
      })
    }
  }
}

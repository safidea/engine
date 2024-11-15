import type { BrowserPage } from '@domain/services/BrowserPage'
import { type BaseEvent } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

export interface OpenEventConfig {
  url: string
}

export class OpenEvent implements BaseEvent {
  constructor(private _config: OpenEventConfig) {}

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

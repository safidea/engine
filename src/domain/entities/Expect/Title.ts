import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

export interface Config {
  title: string
}

export class Title implements Base {
  constructor(private _config: Config) {}

  execute = async (_app: App, page: BrowserPage, _context?: object) => {
    const { title } = this._config
    const pageTitle = await page.getTitle()
    if (pageTitle !== title) {
      throw new TestError({
        code: 'INVALID_TITLE',
        expected: title,
        received: pageTitle,
      })
    }
  }
}

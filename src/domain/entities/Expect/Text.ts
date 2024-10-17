import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

export interface Config {
  text: string
  tag?: keyof HTMLElementTagNameMap
}

export class Text implements Base {
  constructor(private _config: Config) {}

  execute = async (_app: App, page: BrowserPage, _context?: object) => {
    const { tag, text } = this._config
    const textElement = await page.getByText(text, { tag })
    if (!textElement) {
      throw new TestError({
        code: 'TEXT_NOT_FOUND',
        expected: text,
      })
    }
  }
}

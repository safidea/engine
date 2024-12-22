import type { BrowserPage } from '@domain/services/BrowserPage'
import { type BaseExpect } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { StartedApp } from '../App/Started'

export interface TextExpectConfig {
  text: string
  tag?: keyof HTMLElementTagNameMap
}

export class TextExpect implements BaseExpect {
  constructor(private _config: TextExpectConfig) {}

  execute = async (_app: StartedApp, page: BrowserPage, _context?: object) => {
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

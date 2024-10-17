import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

export interface Config {
  attribute: string
  value: string
  tag?: keyof HTMLElementTagNameMap
}

export class Attribute implements Base {
  constructor(private _config: Config) {}

  execute = async (_app: App, page: BrowserPage, _context?: object) => {
    const { tag, attribute, value } = this._config
    const element = await page.getByAttribute(attribute, value, { tag })
    if (!element) {
      throw new TestError({
        code: 'ATTRIBUTE_NOT_FOUND',
        expected: value,
      })
    }
  }
}

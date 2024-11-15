import type { BrowserPage } from '@domain/services/BrowserPage'
import { type BaseEvent } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

export interface ClickEventConfig {
  text: string
}

export class ClickEvent implements BaseEvent {
  constructor(private _config: ClickEventConfig) {}

  execute = async (_app: App, page: BrowserPage) => {
    const { text } = this._config
    const success = await page.click(text)
    if (!success) {
      throw new TestError({
        code: 'BUTTON_NOT_FOUND',
        expected: text,
      })
    }
  }
}

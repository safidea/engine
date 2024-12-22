import type { BrowserPage } from '@domain/services/BrowserPage'
import { type BaseEvent } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { StartedApp } from '../App/Started'

export interface FillEventConfig {
  input: string
  value: string
}

export class FillEvent implements BaseEvent {
  constructor(private _config: FillEventConfig) {}

  execute = async (_app: StartedApp, page: BrowserPage) => {
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

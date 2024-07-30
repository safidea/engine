import { TestError } from '@domain/entities/Error/Test'
import { type Base, type BaseParams } from './base'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { App } from '../App'

interface Params extends BaseParams {
  path: string
  body: object
}

export class Post implements Base {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    const { logger } = _params
    this._log = logger.init('event:post')
  }

  execute = async (app: App, _page: BrowserPage) => {
    const { path, body } = this._params
    this._log(`posting "${JSON.stringify(body)}" to path "${path}"`)
    const res = await fetch(`${app.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      throw new TestError({
        code: 'POST_REQUEST_ERROR',
        expected: 200,
        received: res.status,
      })
    }
  }
}

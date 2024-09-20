import { TestError } from '@domain/entities/Error/Test'
import { type Base, type BaseServices } from './base'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { App } from '../App'

export interface Config {
  path: string
  body: object
}

export type Services = BaseServices

export class Post implements Base {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  execute = async (app: App, _page: BrowserPage) => {
    const { path, body } = this._config
    const { logger } = this._services
    logger.debug(`posting "${JSON.stringify(body)}" to path "${path}"`)
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

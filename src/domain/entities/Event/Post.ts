import { TestError } from '@domain/entities/Error/Test'
import { type BaseEvent } from './base'
import type { BrowserPage } from '@domain/services/BrowserPage'
import type { StartedApp } from '../App/Started'

export interface PostEventConfig {
  path: string
  body?: object
  name?: string
}

export class PostEvent implements BaseEvent {
  constructor(private _config: PostEventConfig) {}

  get name() {
    return this._config.name
  }

  execute = async (app: StartedApp, _page: BrowserPage) => {
    const { path, body = {} } = this._config
    const res = await fetch(`${app.url}${path}`, {
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
        message: await res.text(),
      })
    }
    return res.json()
  }
}

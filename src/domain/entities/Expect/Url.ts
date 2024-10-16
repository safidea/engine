import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

export interface Config {
  url: string
}

export class Url implements Base {
  constructor(private _config: Config) {}

  execute = async (_app: App, page: BrowserPage, _context?: object) => {
    const { url } = this._config
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
    let attempts = 0
    let pageUrl: string | undefined
    while (attempts < 5) {
      pageUrl = await page.getUrl()
      if (pageUrl === url || pageUrl.includes(url)) {
        return
      }
      await delay(1000)
      attempts++
    }
    throw new TestError({
      code: 'INVALID_URL',
      expected: url,
      received: pageUrl,
    })
  }
}

import type { BrowserPage } from '@domain/services/BrowserPage'
import { type BaseExpect } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { StartedApp } from '../App/Started'

export interface UrlExpectConfig {
  url: string
}

export class UrlExpect implements BaseExpect {
  constructor(private _config: UrlExpectConfig) {}

  execute = async (_app: StartedApp, page: BrowserPage, _context?: object) => {
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

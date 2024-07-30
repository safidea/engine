import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

interface Params extends BaseParams {
  url: string
}

export class Url implements Base {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    const { logger } = _params
    this._log = logger.init('expect:url')
  }

  execute = async (_app: App, page: BrowserPage) => {
    const { url } = this._params
    this._log(`checking if page url is "${url}"`)
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

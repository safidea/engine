import type { BrowserPage } from '@domain/services/BrowserPage'
import { type Base, type BaseServices } from './base'
import { TestError } from '@domain/entities/Error/Test'
import type { App } from '../App'

export interface Config {
  url: string
}

export type Services = BaseServices

export class Url implements Base {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  execute = async (_app: App, page: BrowserPage) => {
    const { url } = this._config
    const { logger } = this._services
    logger.debug(`checking if page url is "${url}"`)
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

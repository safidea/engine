import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { TestError } from '@domain/entities/error/Test'

interface Params extends BaseParams {
  url: string
}

export class Url extends BaseWithPage {
  constructor(private params: Params) {
    super()
  }

  executeWithPage = async (page: BrowserPage) => {
    const { url, logger, feature, spec } = this.params
    logger.log(`checking if page url is "${url}"`)
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
      feature,
      spec,
      expected: url,
      received: pageUrl,
    })
  }
}

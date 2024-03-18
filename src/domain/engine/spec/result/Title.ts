import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { TestError } from '@domain/entities/error/Test'

interface Params extends BaseParams {
  title: string
}

export class Title extends BaseWithPage {
  constructor(private params: Params) {
    super()
  }

  executeWithPage = async (page: BrowserPage) => {
    const { title, logger, feature, spec } = this.params
    logger.log(`checking if page title is "${title}"`)
    const pageTitle = await page.getTitle()
    if (pageTitle !== title) {
      throw new TestError({
        code: 'INVALID_TITLE',
        feature,
        spec,
        expected: title,
        received: pageTitle,
      })
    }
  }
}

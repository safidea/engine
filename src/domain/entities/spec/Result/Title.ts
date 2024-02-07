import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { SpecError } from '../SpecError'

interface Params extends BaseParams {
  title: string
}

export class Title extends BaseWithPage {
  constructor(private params: Params) {
    super()
  }

  executeWithPage = async (page: BrowserPage) => {
    const { title, logger, feature, spec } = this.params
    logger.log(`checking if title "${title}" exist`)
    const pageTitle = await page.getTitle()
    if (pageTitle !== title) {
      throw new SpecError('TITLE_NOT_FOUND', {
        feature,
        spec,
        expected: title,
        received: pageTitle,
      })
    }
  }
}

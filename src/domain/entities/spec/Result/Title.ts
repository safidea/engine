import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { SpecError } from '../SpecError'

export interface TitleConfig {
  title: string
}

export class Title extends BaseWithPage {
  constructor(
    private config: TitleConfig,
    private params: BaseParams
  ) {
    super()
  }

  executeWithPage = async (page: BrowserPage) => {
    const { title } = this.config
    const { logger, feature, spec } = this.params
    logger.log(`checking if title "${title}" exist`)
    const pageTitle = await page.title()
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

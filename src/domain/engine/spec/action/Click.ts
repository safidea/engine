import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { TestError } from '@domain/entities/error/Test'

interface Params extends BaseParams {
  click: string
}

export class Click extends BaseWithPage {
  constructor(private params: Params) {
    super()
  }

  executeWithPage = async (page: BrowserPage) => {
    const { click, logger, feature, spec } = this.params
    logger.log(`clicking "${click}"`)
    const success = await page.click(click)
    if (!success) {
      throw new TestError({
        code: 'BUTTON_NOT_FOUND',
        feature,
        spec,
        expected: click,
      })
    }
  }
}

import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { SpecError } from '../SpecError'

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
      throw new SpecError('BUTTON_NOT_FOUND', {
        feature,
        spec,
        expected: click,
      })
    }
  }
}

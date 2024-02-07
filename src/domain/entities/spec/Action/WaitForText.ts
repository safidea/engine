import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { SpecError } from '../SpecError'

interface Params extends BaseParams {
  waitForText: string
  timeout?: number
}

export class WaitForText extends BaseWithPage {
  constructor(private params: Params) {
    super()
  }

  executeWithPage = async (page: BrowserPage) => {
    const { waitForText, timeout, logger, feature, spec } = this.params
    logger.log(`waiting for text "${waitForText}"`)
    const success = await page.waitForText(waitForText, { timeout })
    if (!success) {
      throw new SpecError('TEXT_NOT_FOUND', {
        feature,
        spec,
        expected: waitForText,
      })
    }
  }
}

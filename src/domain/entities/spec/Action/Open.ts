import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { SpecError } from '../SpecError'

interface Params extends BaseParams {
  open: string
}

export class Open extends BaseWithPage {
  constructor(private params: Params) {
    super()
  }

  executeWithPage = async (page: BrowserPage) => {
    const { open, logger, feature, spec } = this.params
    logger.log(`opening "${open}"`)
    const success = await page.open(open)
    if (!success) {
      throw new SpecError('PAGE_NOT_FOUND', {
        feature,
        spec,
        expected: open,
      })
    }
  }
}

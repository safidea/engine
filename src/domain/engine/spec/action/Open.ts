import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { TestError } from '@domain/entities/error/Test'

interface Params extends BaseParams {
  open: string
}

export class Open extends BaseWithPage {
  constructor(private params: Params) {
    super()
  }

  executeWithPage = async (page: BrowserPage) => {
    const { open, logger, spec } = this.params
    logger.log(`opening "${open}"`)
    const success = await page.open(open)
    if (!success) {
      throw new TestError({
        code: 'PAGE_NOT_FOUND',
        spec,
        expected: open,
      })
    }
  }
}

import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'

interface Params extends BaseParams {
  open: string
}

export class Open extends BaseWithPage {
  constructor(private params: Params) {
    super()
  }

  executeWithPage = async (page: BrowserPage) => {
    const { open, logger } = this.params
    logger.log(`opening "${open}"`)
    await page.open(open)
  }
}

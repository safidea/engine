import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'

export interface OpenConfig {
  open: string
}

export class Open extends BaseWithPage {
  constructor(
    private config: OpenConfig,
    private params: BaseParams
  ) {
    super()
  }

  executeWithPage = async (page: BrowserPage) => {
    const { open } = this.config
    const { logger } = this.params
    logger.log(`opening "${open}"`)
    await page.open(open)
  }
}

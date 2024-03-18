import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { TestError } from '@domain/entities/error/Test'

interface Params extends BaseParams {
  fill: string
  value: string
}

export class Fill extends BaseWithPage {
  constructor(private params: Params) {
    super()
  }

  executeWithPage = async (page: BrowserPage) => {
    const { fill, value, logger, feature, spec } = this.params
    logger.log(`typing "${value}" in input "${fill}"`)
    const success = await page.type(fill, value)
    if (!success) {
      throw new TestError({
        code: 'INPUT_NOT_FOUND',
        feature,
        spec,
        expected: value,
        received: '',
      })
    }
  }
}

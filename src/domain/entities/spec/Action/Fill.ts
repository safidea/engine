import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { SpecError } from '../SpecError'

export interface FillConfig {
  fill: string
  value: string
}

export class Fill extends BaseWithPage {
  constructor(
    private config: FillConfig,
    private params: BaseParams
  ) {
    super()
  }

  executeWithPage = async (page: BrowserPage) => {
    const { fill, value } = this.config
    const { logger, feature, spec } = this.params
    logger.log(`typing "${value}" in input "${fill}"`)
    const inputElement = await page.getInputByName(fill)
    if (inputElement) {
      await inputElement.type(value)
    } else {
      throw new SpecError('INPUT_NOT_FOUND', {
        feature,
        spec,
        expected: value,
        received: '',
      })
    }
  }
}

import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { SpecError } from '../SpecError'

export interface InputTextConfig {
  input: string
  value: string
}

export class InputText extends BaseWithPage {
  constructor(
    private config: InputTextConfig,
    private params: BaseParams
  ) {
    super()
  }

  executeWithPage = async (page: BrowserPage) => {
    const { input, value } = this.config
    const { logger, feature, spec } = this.params
    logger.log(`checking if input "${input}" has value "${value}"`)
    const inputValue = await page.getInputByName(input)
    const attributeValue = await inputValue?.getValue()
    if (attributeValue !== value) {
      throw new SpecError('INPUT_NOT_FOUND', {
        feature,
        spec,
        expected: value,
        received: attributeValue,
      })
    }
  }
}

import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { SpecError } from '../SpecError'

interface Params extends BaseParams {
  input: string
  value: string
}

export class InputText extends BaseWithPage {
  constructor(private params: Params) {
    super()
  }

  executeWithPage = async (page: BrowserPage) => {
    const { input, value, logger, feature, spec } = this.params
    logger.log(`checking if input "${input}" with value "${value}" exist`)
    const inputElement = await page.getByAttribute('name', input, { tag: 'input' })
    const attributeValue = await inputElement?.getInputValue()
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

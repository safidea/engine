import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'

interface Params extends BaseParams {
  input: string
  value: string
}

export class InputText extends BaseWithPage {
  private log: (message: string) => void

  constructor(private params: Params) {
    super()
    const { logger } = params
    this.log = logger.init('expect:input-text')
  }

  executeWithPage = async (page: BrowserPage) => {
    const { input, value } = this.params
    this.log(`checking if input "${input}" with value "${value}" exist`)
    const inputElement = await page.getByAttribute('name', input, { tag: 'input' })
    const attributeValue = await inputElement?.getInputValue()
    if (attributeValue !== value) {
      throw new TestError({
        code: 'INPUT_NOT_FOUND',
        expected: value,
        received: attributeValue,
      })
    }
  }
}

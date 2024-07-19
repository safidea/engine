import type { BrowserPage } from '@domain/services/BrowserPage'
import { BaseWithPage, type BaseParams } from './base'
import { TestError } from '@domain/entities/Error/Test'

interface Params extends BaseParams {
  input: string
  value: string
}

export class Fill extends BaseWithPage {
  private log: (message: string) => void

  constructor(private params: Params) {
    super()
    const { logger } = params
    this.log = logger.init('event:fill')
  }

  executeWithPage = async (page: BrowserPage) => {
    const { input, value } = this.params
    this.log(`typing "${value}" in input "${input}"`)
    const success = await page.type(input, value)
    if (!success) {
      throw new TestError({
        code: 'INPUT_NOT_FOUND',
        expected: value,
        received: '',
      })
    }
  }
}

import type { IEntity } from '../IEntity'
import type { ISpec } from './ISpec'
import type { ISpecParams } from './ISpecParams'
import { SpecError } from './SpecError'

export class Spec implements IEntity {
  name: string

  constructor(
    private config: ISpec,
    private params: ISpecParams
  ) {
    this.name = config.name
  }

  validateConfig() {
    return []
  }

  async test(feature: string, baseUrl: string): Promise<SpecError | undefined> {
    const { when, then } = this.config
    const { browser } = this.params.drivers
    const page = await browser.launch({ baseUrl, logName: `spec:${this.name}` })
    for (const action of when) {
      if ('open' in action) {
        await page.open(action.open)
      }
    }
    for (const result of then) {
      if ('text' in result) {
        const textElement = await page.getByText(result.text)
        if (!textElement) {
          return new SpecError('TEXT_NOT_FOUND', {
            feature,
            spec: this.name,
            text: result.text,
          })
        }
      }
    }
    await page.close()
  }
}

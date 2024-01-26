import type { IEntity } from '../IEntity'
import type { ISpec } from './ISpec'
import type { ISpecParams } from './ISpecParams'
import { SpecError } from './SpecError'

export class Spec implements IEntity {
  name: string
  private log: (message: string) => void

  constructor(
    private config: ISpec,
    private params: ISpecParams
  ) {
    const { drivers, featureName } = params
    const { logger } = drivers
    this.name = config.name
    this.log = logger.init(`feature:${logger.slug(featureName)}:spec:${logger.slug(this.name)}`)
  }

  validateConfig() {
    return []
  }

  async test(baseUrl: string): Promise<SpecError | undefined> {
    const { when, then } = this.config
    const { browser } = this.params.drivers
    const page = await browser.launch({ baseUrl })
    try {
      for (const action of when) {
        if ('open' in action) {
          this.log(`opening "${action.open}"`)
          await page.open(action.open)
        }
      }
      for (const result of then) {
        if ('title' in result) {
          this.log(`checking title "${result.title}"`)
          const pageTitle = await page.title()
          if (pageTitle !== result.title) {
            throw new SpecError('TITLE_NOT_FOUND', {
              feature: this.params.featureName,
              spec: this.name,
              expected: result.title,
              received: pageTitle,
            })
          }
        }
        if ('text' in result) {
          const { tag, text, attribute, value } = result
          this.log(`checking text "${result.text}"`)
          const textElement = await page.getByText(text, { tag })
          if (attribute && textElement) {
            const attributeValue = await textElement.getAttribute(attribute)
            if (attributeValue !== value) {
              throw new SpecError('ATTRIBUTE_NOT_FOUND', {
                feature: this.params.featureName,
                spec: this.name,
                expected: value,
                received: attributeValue,
              })
            }
          } else if (!textElement) {
            throw new SpecError('TEXT_NOT_FOUND', {
              feature: this.params.featureName,
              spec: this.name,
              expected: text,
              received: '',
            })
          }
        }
      }
      await page.close()
      this.log('passed')
    } catch (error) {
      await page.close()
      this.log('failed')
      if (error instanceof SpecError) return error
      else throw error
    }
  }
}

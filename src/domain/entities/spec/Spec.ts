import type { IBrowserPage } from '@domain/drivers/IBrowser'
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
    const { drivers, databaseInstance } = this.params
    const { browser } = drivers
    let page: IBrowserPage | undefined
    if (when.find((action) => 'open' in action)) {
      page = await browser.launch({ baseUrl })
    }
    try {
      for (const action of when) {
        if ('open' in action) {
          this.log(`opening "${action.open}"`)
          await page?.open(action.open)
        } else if ('fill' in action) {
          const { fill, value } = action
          this.log(`typing "${value}" in input "${fill}"`)
          const inputElement = await page?.getInputByName(fill)
          if (inputElement) {
            await inputElement.type(value)
          } else {
            throw new SpecError('INPUT_NOT_FOUND', {
              feature: this.params.featureName,
              spec: this.name,
              expected: value,
              received: '',
            })
          }
        } else if ('post' in action) {
          const { post, body } = action
          this.log(`posting "${JSON.stringify(body)}" to "${post}"`)
          const res = await fetch(`${baseUrl}${post}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          })
          if (!res.ok) {
            throw new SpecError('POST_REQUEST_ERROR', {
              feature: this.params.featureName,
              spec: this.name,
              expected: '200',
              received: res.status.toString(),
            })
          }
        }
      }
      for (const result of then) {
        if ('title' in result) {
          const { title } = result
          this.log(`checking if title "${title}" exist`)
          const pageTitle = await page?.title()
          if (pageTitle !== result.title) {
            throw new SpecError('TITLE_NOT_FOUND', {
              feature: this.params.featureName,
              spec: this.name,
              expected: title,
              received: pageTitle,
            })
          }
        } else if ('text' in result) {
          const { tag, text, attribute, value } = result
          if (attribute) {
            const attributeMessage = `checking if attribute "${attribute}" has value "${value}" in text "${text}"`
            this.log(tag ? `${attributeMessage} with tag "${tag}"` : attributeMessage)
          } else {
            const textMessage = `checking if text "${text}" exist`
            this.log(tag ? `${textMessage} with tag "${tag}"` : textMessage)
          }
          const textElement = await page?.getByText(text, { tag })
          if (attribute && textElement) {
            const attributeValue = await textElement.getAttribute(attribute)
            if (attributeValue !== value) {
              throw new SpecError('ATTRIBUTE_NOT_FOUND', {
                feature: this.params.featureName,
                spec: this.name,
                expected: value,
                received: attributeValue,
                tag,
              })
            }
          } else if (!textElement) {
            throw new SpecError('TEXT_NOT_FOUND', {
              feature: this.params.featureName,
              spec: this.name,
              expected: text,
              received: '',
              tag,
            })
          }
        } else if ('input' in result) {
          const { input, value } = result
          this.log(`checking if input "${input}" has value "${value}"`)
          const inputValue = await page?.getInputByName(input)
          const attributeValue = await inputValue?.getValue()
          if (attributeValue !== value) {
            throw new SpecError('INPUT_NOT_FOUND', {
              feature: this.params.featureName,
              spec: this.name,
              expected: value,
              received: attributeValue,
            })
          }
        } else if ('table' in result) {
          const { table, row } = result
          this.log(`checking if table "${table}" has row "${JSON.stringify(row)}"`)
          const tableRow = await databaseInstance?.table(table).read(row)
          if (!tableRow) {
            throw new SpecError('ROW_NOT_FOUND', {
              feature: this.params.featureName,
              spec: this.name,
              expected: JSON.stringify(tableRow),
              received: undefined,
            })
          }
        }
      }
      await page?.close()
      this.log('passed')
    } catch (error) {
      await page?.close()
      this.log('failed')
      if (error instanceof SpecError) return error
      else throw error
    }
  }
}

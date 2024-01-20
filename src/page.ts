import { PageEntity } from '@domain/entities/page/PageEntity'
import { drivers } from '@drivers/index'
import { PageError } from '@domain/entities/page/PageError'

export class Page {
  errors: PageError[] = []
  entity: PageEntity | undefined

  constructor(public config: unknown) {
    const { jsonValidator } = drivers
    const { json, errors } = jsonValidator.validatePageConfig(config)
    if (errors) {
      this.errors = errors
    } else {
      this.entity = new PageEntity(json)
    }
  }
}

export type { IPage } from '@domain/entities/page/IPage'
export { PageError }

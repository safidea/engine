import { PageEntity } from '@domain/entities/page/PageEntity'
import { drivers } from '@drivers/index'
import { PageError } from '@domain/entities/page/PageError'
import type { IComponent } from '@domain/entities/component/IComponent'
import { ComponentList } from '@domain/entities/component/ComponentList'

export class Page {
  errors: PageError[] = []
  entity: PageEntity | undefined

  constructor(
    public config: unknown,
    params: {
      components: IComponent[]
    }
  ) {
    const { jsonValidator } = drivers
    const { json, errors } = jsonValidator.validatePageConfig(config)
    if (errors) {
      this.errors = errors
    } else {
      const components = new ComponentList(params.components)
      this.entity = new PageEntity(json, { components })
      if (this.entity.errors.length) {
        this.errors = this.entity.errors
      }
    }
  }
}

export type { IPage } from '@domain/entities/page/IPage'
export { PageError }

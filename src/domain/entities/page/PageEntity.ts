import type { IPage } from './IPage'
import type { IPageComponent } from './IPageComponent'
import type { IPageParams } from './IPageParams'
import { PageError } from './PageError'

export class PageEntity {
  errors: PageError[] = []

  constructor(
    public config: IPage,
    params: IPageParams
  ) {
    this.validatePageConfig(params)
  }

  validatePageConfig(params: IPageParams) {
    const { components } = params
    const { body } = this.config
    const validateComponents = (body: IPageComponent[]) => {
      for (const { component, children } of body) {
        if (!components.includes(component)) {
          this.errors.push(new PageError('COMPONENT_NOT_FOUND', { component }))
        }
        if (children) validateComponents(children)
      }
    }
    validateComponents(body)
  }
}

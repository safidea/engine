import { Page } from '@domain/entities/page/Page'
import { drivers } from '@drivers/index'
import { PageError } from '@domain/entities/page/PageError'
import type { IComponent } from '@domain/entities/component/IComponent'
import { ComponentList } from '@domain/entities/component/ComponentList'

export function createPage(
  config: unknown,
  params: {
    components: IComponent[]
  }
): { errors: PageError[]; page: undefined } | { page: Page; errors: undefined } {
  const { jsonValidator } = drivers
  const { json, errors } = jsonValidator.validatePageConfig(config)
  if (errors) {
    return { errors, page: undefined }
  } else {
    const components = new ComponentList(params.components)
    const page = new Page(json, { components })
    const errors = page.validateConfig()
    if (errors.length) {
      return { errors, page: undefined }
    }
    return { page, errors: undefined }
  }
}

export type { IPage } from '@domain/entities/page/IPage'
export { PageError }

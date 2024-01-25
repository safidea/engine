import { Page } from '@domain/entities/page/Page'
import { drivers } from '@drivers/index'
import { PageError } from '@domain/entities/page/PageError'
import type { EngineError } from '@domain/entities/EngineError'
import { PageController } from './adapter/controllers/PageController'
import type { Components } from '@domain/components'

export function createPage(
  config: unknown,
  params?: {
    components?: Partial<Components>
  }
): { page?: Page; errors: EngineError[] } {
  const pageController = new PageController(drivers, params)
  const { entity, errors } = pageController.createEntity(config)
  return { page: entity, errors }
}

export type { IPage } from '@domain/entities/page/IPage'
export { PageError }

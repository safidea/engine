import { Page } from '@domain/entities/page/Page'
import { drivers } from '@drivers/index'
import { PageError } from '@domain/entities/page/PageError'
import type { EngineError } from '@domain/entities/EngineError'
import { PageController } from './adapter/controllers/PageController'
import type { Components } from '@domain/components'

export async function createPage(
  config: unknown,
  params?: {
    components?: Partial<Components>
    featureName?: string
  }
): Promise<{ page?: Page; errors: EngineError[] }> {
  const pageController = new PageController(drivers, params)
  const { entity, errors } = await pageController.createEntity(config)
  return { page: entity, errors }
}

export type { IPage } from '@domain/entities/page/IPage'
export { PageError }

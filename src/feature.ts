import { Feature } from '@domain/entities/feature/Feature'
import { drivers } from '@drivers/index'
import { FeatureError } from '@domain/entities/feature/FeatureError'
import type { IRole } from './role'
import type { EngineError } from '@domain/entities/EngineError'
import { FeatureController } from './adapter/controllers/FeatureController'
import type { Components } from '@domain/components'

export function createFeature(
  config: unknown,
  params?: {
    roles?: IRole[]
    components?: Components
  }
): { feature?: Feature; errors: EngineError[] } {
  const featureController = new FeatureController(drivers, params)
  const { entity, errors } = featureController.createEntity(config)
  return { feature: entity, errors }
}

export type { IFeature } from '@domain/entities/feature/IFeature'
export { FeatureError }

import { Spec } from '@domain/entities/spec/Spec'
import { drivers } from '@drivers/index'
import { SpecError } from '@domain/entities/spec/SpecError'
import type { EngineError } from '@domain/entities/EngineError'
import { SpecController } from './adapter/controllers/SpecController'

export function createSpec(
  config: unknown,
  params?: { featureName?: string }
): { spec?: Spec; errors: EngineError[] } {
  const specController = new SpecController(drivers, params)
  const { entity, errors } = specController.createEntity(config)
  return { spec: entity, errors }
}

export type { ISpec } from '@domain/entities/spec/ISpec'
export { SpecError }

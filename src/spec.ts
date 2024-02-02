import { Spec } from 'src_OLD/domain/entities/spec/Spec'
import { drivers } from 'src_OLD/drivers/index'
import { SpecError } from 'src_OLD/domain/entities/spec/SpecError'
import type { EngineError } from 'src_OLD/domain/entities/EngineError'
import { SpecController } from './adapter/controllers/SpecController'

export async function createSpec(
  config: unknown,
  params?: { featureName?: string }
): Promise<{ spec?: Spec; errors: EngineError[] }> {
  const specController = new SpecController(drivers, params)
  const { entity, errors } = await specController.createEntity(config)
  return { spec: entity, errors }
}

export type { ISpec } from 'src_OLD/domain/entities/spec/ISpec'
export { SpecError }

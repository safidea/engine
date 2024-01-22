import { Spec } from '@domain/entities/spec/Spec'
import { drivers } from '@drivers/index'
import { SpecError } from '@domain/entities/spec/SpecError'

export function createSpec(
  config: unknown
): { errors: SpecError[]; spec: undefined } | { spec: Spec; errors: undefined } {
  const { jsonValidator } = drivers
  const { json, errors } = jsonValidator.validateSpecConfig(config)
  if (errors) {
    return { errors, spec: undefined }
  } else {
    const spec = new Spec(json)
    const errors = spec.validateConfig()
    if (errors.length) {
      return { errors, spec: undefined }
    }
    return { spec, errors: undefined }
  }
}

export type { ISpec } from '@domain/entities/spec/ISpec'
export { SpecError }

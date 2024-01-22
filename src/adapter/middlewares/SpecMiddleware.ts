import type { Drivers } from '@domain/drivers'
import type { ISpec } from '@domain/entities/spec/ISpec'
import { SpecError } from '@domain/entities/spec/SpecError'
import type { IMiddleware } from './IMiddleware'

export class SpecMiddleware implements IMiddleware<ISpec> {
  constructor(private drivers: Drivers) {}

  validateSchema(data: unknown) {
    const { json, errors: schemaValidatorErrors } =
      this.drivers.schemaValidator.validateSchema<ISpec>(data, 'spec')
    if (json) return { json }
    const errors = schemaValidatorErrors?.map((error) => {
      const { instancePath, keyword, params } = error
      if (keyword === 'required') {
        if (params.missingProperty === 'name') return new SpecError('NAME_REQUIRED')
        if (params.missingProperty === 'when') return new SpecError('WHEN_REQUIRED')
        if (params.missingProperty === 'then') return new SpecError('THEN_REQUIRED')
      } else if (keyword === 'additionalProperties') {
        return new SpecError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
      } else if (keyword === 'type') {
        if (instancePath === '/name') return new SpecError('NAME_STRING_TYPE_REQUIRED')
      }
      throw new Error('Unknown AJV error: ' + JSON.stringify(error, null, 2))
    })
    return { errors }
  }
}

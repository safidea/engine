import type { Drivers } from '@domain/drivers'
import { ComponentError, type IComponent } from 'src/component'
import type { IMiddleware } from './IMiddleware'

export class ComponentMiddleware implements IMiddleware<IComponent> {
  constructor(private drivers: Drivers) {}

  validateSchema(data: unknown) {
    const { json, errors: schemaValidatorErrors } =
      this.drivers.schemaValidator.validateSchema<IComponent>(data, 'component')
    if (json) return { json }
    const errors = schemaValidatorErrors
      ?.filter(({ keyword }) => {
        return keyword !== 'anyOf' && keyword !== 'const'
      })
      .map((error) => {
        const { instancePath, keyword, params } = error
        if (keyword === 'required') {
          if (params.missingProperty === 'name') return new ComponentError('NAME_REQUIRED')
          if (params.missingProperty === 'template') return new ComponentError('TEMPLATE_REQUIRED')
        } else if (keyword === 'additionalProperties') {
          return new ComponentError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
        } else if (keyword === 'type') {
          if (instancePath === '/name') return new ComponentError('NAME_STRING_TYPE_REQUIRED')
        }
        throw new Error('Unknown AJV error: ' + JSON.stringify(error, null, 2))
      })
    return { errors }
  }
}

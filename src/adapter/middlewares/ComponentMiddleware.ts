import type { Drivers } from '@domain/drivers'
import { type IComponent } from 'src/component'
import type { IMiddleware } from './IMiddleware'
import { ComponentMapper } from '../mappers/ComponentMapper'

export class ComponentMiddleware implements IMiddleware<IComponent> {
  private mapper = new ComponentMapper()

  constructor(private drivers: Drivers) {}

  validateSchema(data: unknown) {
    const { json, errors } = this.drivers.schemaValidator.validateSchema<IComponent>(
      data,
      'component'
    )
    if (json) return { json }
    if (!errors) return { errors: [] }
    return { errors: this.mapper.schemaValidatorToEngineErrors(errors) }
  }
}

import type { Drivers } from '@domain/drivers'
import type { ISpec } from '@domain/entities/spec/ISpec'
import type { IMiddleware } from './IMiddleware'
import { SpecMapper } from '../mappers/SpecMapper'

export class SpecMiddleware implements IMiddleware<ISpec> {
  private mapper = new SpecMapper()

  constructor(private drivers: Drivers) {}

  validateSchema(data: unknown) {
    const { json, errors } = this.drivers.schemaValidator.validateSchema<ISpec>(data, 'spec')
    return { json, errors: this.mapper.schemaValidatorToEngineErrors(errors) }
  }
}

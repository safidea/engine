import type { Drivers } from '@domain/drivers'
import type { IApp } from '@domain/entities/app/IApp'
import type { IMiddleware } from './IMiddleware'
import { AppMapper } from '../mappers/AppMapper'

export class AppMiddleware implements IMiddleware<IApp> {
  private mapper = new AppMapper()

  constructor(private drivers: Drivers) {}

  validateSchema(data: unknown) {
    const { json, errors } = this.drivers.schemaValidator.validateSchema<IApp>(data, 'app')
    return { json, errors: this.mapper.schemaValidatorToEngineErrors(errors) }
  }
}

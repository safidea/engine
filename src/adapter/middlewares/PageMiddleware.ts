import type { Drivers } from '@domain/drivers'
import type { IPage } from '@domain/entities/page/IPage'
import type { IMiddleware } from './IMiddleware'
import { PageMapper } from '../mappers/PageMapper'

export class PageMiddleware implements IMiddleware<IPage> {
  private mapper = new PageMapper()

  constructor(private drivers: Drivers) {}

  validateSchema(data: unknown) {
    const { json, errors } = this.drivers.schemaValidator.validateSchema<IPage>(data, 'page')
    return { json, errors: this.mapper.schemaValidatorToEngineErrors(errors) }
  }
}

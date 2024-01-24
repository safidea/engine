import type { Drivers } from '@domain/drivers'
import type { IFeature } from '@domain/entities/feature/IFeature'
import type { IMiddleware } from './IMiddleware'
import { FeatureMapper } from '../mappers/FeatureMapper'

export class FeatureMiddleware implements IMiddleware<IFeature> {
  private mapper = new FeatureMapper()

  constructor(private drivers: Drivers) {}

  validateSchema(data: unknown) {
    const { json, errors } = this.drivers.schemaValidator.validateSchema<IFeature>(data, 'feature')
    return { json, errors: this.mapper.schemaValidatorToEngineErrors(errors) }
  }
}

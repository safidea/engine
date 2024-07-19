import type { Drivers } from '@adapter/spi/Drivers'
import { SchemaValidatorSpi } from '@adapter/spi/SchemaValidatorSpi'
import { SchemaValidator } from '@domain/services/SchemaValidator'

interface Ressources {
  drivers: Drivers
}

export class SchemaValidatorMapper {
  static toService(ressources: Ressources): SchemaValidator {
    const { drivers } = ressources
    const driver = drivers.schemaValidator()
    const spi = new SchemaValidatorSpi(driver)
    return new SchemaValidator(spi)
  }
}

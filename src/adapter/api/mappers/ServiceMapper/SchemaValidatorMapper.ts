import type { Drivers } from '@adapter/spi/Drivers'
import { SchemaValidatorSpi } from '@adapter/spi/SchemaValidatorSpi'
import { SchemaValidator } from '@domain/services/SchemaValidator'

export class SchemaValidatorMapper {
  static toService(drivers: Drivers): SchemaValidator {
    const driver = drivers.schemaValidator()
    const spi = new SchemaValidatorSpi(driver)
    return new SchemaValidator(spi)
  }
}

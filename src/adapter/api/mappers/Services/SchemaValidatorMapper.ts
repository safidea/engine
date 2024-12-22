import type { Drivers } from '@adapter/spi/drivers'
import { SchemaValidatorSpi } from '@adapter/spi/drivers/SchemaValidatorSpi'
import { SchemaValidator } from '@domain/services/SchemaValidator'

export class SchemaValidatorMapper {
  static toService(drivers: Drivers): SchemaValidator {
    const driver = drivers.schemaValidator()
    const spi = new SchemaValidatorSpi(driver)
    return new SchemaValidator(spi)
  }
}

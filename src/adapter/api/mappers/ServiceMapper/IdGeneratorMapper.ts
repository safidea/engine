import type { Drivers } from '@adapter/spi/Drivers'
import { IdGeneratorSpi } from '@adapter/spi/IdGeneratorSpi'
import { IdGenerator } from '@domain/services/IdGenerator'

export class IdGeneratorMapper {
  static toService(drivers: Drivers): IdGenerator {
    const driver = drivers.idGenerator()
    const spi = new IdGeneratorSpi(driver)
    return new IdGenerator(spi)
  }
}

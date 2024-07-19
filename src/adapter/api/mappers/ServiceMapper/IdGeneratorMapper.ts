import type { Drivers } from '@adapter/spi/Drivers'
import { IdGeneratorSpi } from '@adapter/spi/IdGeneratorSpi'
import { IdGenerator } from '@domain/services/IdGenerator'

interface Ressources {
  drivers: Drivers
}

export class IdGeneratorMapper {
  static toService(ressources: Ressources): IdGenerator {
    const { drivers } = ressources
    const driver = drivers.idGenerator()
    const spi = new IdGeneratorSpi(driver)
    return new IdGenerator(spi)
  }
}

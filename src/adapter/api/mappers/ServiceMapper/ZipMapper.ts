import type { Drivers } from '@adapter/spi/Drivers'
import { ZipSpi } from '@adapter/spi/ZipSpi'
import { Zip } from '@domain/services/Zip'

interface Ressources {
  drivers: Drivers
}

export class ZipMapper {
  static toService(ressources: Ressources): Zip {
    const { drivers } = ressources
    const driver = drivers.zip()
    const spi = new ZipSpi(driver)
    return new Zip(spi)
  }
}

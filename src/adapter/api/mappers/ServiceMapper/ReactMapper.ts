import type { Drivers } from '@adapter/spi/Drivers'
import { ReactSpi } from '@adapter/spi/ReactSpi'
import { React } from '@domain/services/React'

interface Ressources {
  drivers: Drivers
}

export class ReactMapper {
  static toService(ressources: Ressources): React {
    const { drivers } = ressources
    const driver = drivers.react()
    const spi = new ReactSpi(driver)
    return new React(spi)
  }
}

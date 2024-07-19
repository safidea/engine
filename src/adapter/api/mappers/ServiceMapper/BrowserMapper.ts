import type { Drivers } from '@adapter/spi/Drivers'
import { BrowserSpi } from '@adapter/spi/BrowserSpi'
import { Browser } from '@domain/services/Browser'
import type { IdGenerator } from '@domain/services/IdGenerator'

interface Ressources {
  drivers: Drivers
  idGenerator: IdGenerator
}

export class BrowserMapper {
  static toService(ressources: Ressources): Browser {
    const { drivers, ...services } = ressources
    const driver = drivers.browser()
    const spi = new BrowserSpi(driver)
    return new Browser(spi, services)
  }
}

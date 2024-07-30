import type { Drivers } from '@adapter/spi/Drivers'
import { BrowserSpi } from '@adapter/spi/BrowserSpi'
import { Browser } from '@domain/services/Browser'

interface Ressources {
  drivers: Drivers
}

export class BrowserMapper {
  static toService(ressources: Ressources): Browser {
    const { drivers } = ressources
    const driver = drivers.browser()
    const spi = new BrowserSpi(driver)
    return new Browser(spi)
  }
}

import type { Drivers } from '@adapter/spi/Drivers'
import { BrowserSpi } from '@adapter/spi/BrowserSpi'
import { Browser } from '@domain/services/Browser'

export class BrowserMapper {
  static toService(drivers: Drivers): Browser {
    const driver = drivers.browser()
    const spi = new BrowserSpi(driver)
    return new Browser(spi)
  }
}

import type { Drivers } from '@adapter/spi/drivers'
import { BrowserSpi } from '@adapter/spi/drivers/BrowserSpi'
import { Browser } from '@domain/services/Browser'

export class BrowserMapper {
  static toService(drivers: Drivers): Browser {
    const driver = drivers.browser()
    const spi = new BrowserSpi(driver)
    return new Browser(spi)
  }
}

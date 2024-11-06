import type { Drivers } from '@adapter/spi/drivers'
import { SpreadsheetLoaderSpi } from '@adapter/spi/drivers/SpreadsheetLoaderSpi'
import { SpreadsheetLoader, type Services } from '@domain/services/SpreadsheetLoader'

export class SpreadsheetLoaderMapper {
  static toService(drivers: Drivers, services: Services): SpreadsheetLoader {
    const driver = drivers.spreadsheetLoader()
    const spi = new SpreadsheetLoaderSpi(driver)
    return new SpreadsheetLoader(spi, services)
  }
}

import type { Drivers } from '@adapter/spi/Drivers'
import { SpreadsheetLoaderSpi } from '@adapter/spi/SpreadsheetLoaderSpi'
import { SpreadsheetLoader, type Services } from '@domain/services/SpreadsheetLoader'

export class SpreadsheetLoaderMapper {
  static toService(drivers: Drivers, services: Services): SpreadsheetLoader {
    const driver = drivers.spreadsheetLoader()
    const spi = new SpreadsheetLoaderSpi(driver)
    return new SpreadsheetLoader(spi, services)
  }
}

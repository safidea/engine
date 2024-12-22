import type { Drivers } from '@adapter/spi/drivers'
import { SpreadsheetLoaderSpi } from '@adapter/spi/drivers/SpreadsheetLoaderSpi'
import {
  SpreadsheetLoader,
  type SpreadsheetLoaderServices,
} from '@domain/services/SpreadsheetLoader'

export class SpreadsheetLoaderMapper {
  static toService(drivers: Drivers, services: SpreadsheetLoaderServices): SpreadsheetLoader {
    const driver = drivers.spreadsheetLoader()
    const spi = new SpreadsheetLoaderSpi(driver)
    return new SpreadsheetLoader(spi, services)
  }
}

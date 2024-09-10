import type { Drivers } from '@adapter/spi/Drivers'
import { SpreadsheetLoaderSpi } from '@adapter/spi/SpreadsheetLoaderSpi'
import { SpreadsheetLoader } from '@domain/services/SpreadsheetLoader'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Ressources {
  drivers: Drivers
  templateCompiler: TemplateCompiler
}

export class SpreadsheetLoaderMapper {
  static toService(ressources: Ressources): SpreadsheetLoader {
    const { drivers, ...services } = ressources
    const driver = drivers.spreadsheetLoader()
    const spi = new SpreadsheetLoaderSpi(driver)
    return new SpreadsheetLoader(spi, services)
  }
}

import type { Drivers } from '@adapter/spi/drivers'
import { FontLibrarySpi } from '@adapter/spi/drivers/FontLibrarySpi'
import { FontLibrary, type FontLibraryServices } from '@domain/services/FontLibrary'

export class FontLibraryMapper {
  static toService(drivers: Drivers, services: FontLibraryServices): FontLibrary {
    const driver = drivers.fontLibrary()
    const spi = new FontLibrarySpi(driver)
    return new FontLibrary(spi, services)
  }
}

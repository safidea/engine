import type { Drivers } from '@adapter/spi/drivers'
import { IconLibrarySpi } from '@adapter/spi/drivers/IconLibrarySpi'
import { IconLibrary } from '@domain/services/IconLibrary'

export class IconLibraryMapper {
  static toService(drivers: Drivers): IconLibrary {
    const driver = drivers.iconLibrary()
    const spi = new IconLibrarySpi(driver)
    return new IconLibrary(spi)
  }
}

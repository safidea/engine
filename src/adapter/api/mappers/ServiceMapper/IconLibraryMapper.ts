import type { Drivers } from '@adapter/spi/Drivers'
import { IconLibrarySpi } from '@adapter/spi/IconLibrarySpi'
import { IconLibrary } from '@domain/services/IconLibrary'

interface Ressources {
  drivers: Drivers
}

export class IconLibraryMapper {
  static toService(ressources: Ressources): IconLibrary {
    const { drivers } = ressources
    const driver = drivers.iconLibrary()
    const spi = new IconLibrarySpi(driver)
    return new IconLibrary(spi)
  }
}

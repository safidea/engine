import type { Drivers } from '@adapter/spi/Drivers'
import { FontLibrarySpi } from '@adapter/spi/FontLibrarySpi'
import { FontLibrary } from '@domain/services/FontLibrary'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Server } from '@domain/services/Server'

interface Ressources {
  drivers: Drivers
  server: Server
  idGenerator: IdGenerator
}

export class FontLibraryMapper {
  static toService(ressources: Ressources): FontLibrary {
    const { drivers, ...services } = ressources
    const driver = drivers.fontLibrary()
    const spi = new FontLibrarySpi(driver)
    return new FontLibrary(spi, services)
  }
}

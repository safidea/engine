import type { Drivers } from '@adapter/spi/Drivers'
import { ThemeSpi } from '@adapter/spi/ThemeSpi'
import { Theme } from '@domain/services/Theme'
import type { Theme as Config } from '@adapter/api/configs/Services/Theme'
import type { Server } from '@domain/services/Server'
import type { FontLibrary } from '@domain/services/FontLibrary'

interface Ressources {
  drivers: Drivers
  server: Server
  fontLibrary: FontLibrary
}

export class ThemeMapper {
  static toService(ressources: Ressources, config: Config): Theme {
    const { drivers, ...services } = ressources
    const driver = drivers.theme(config)
    const spi = new ThemeSpi(driver)
    return new Theme(spi, services, config)
  }
}

import type { Drivers } from '@adapter/spi/Drivers'
import { ThemeSpi } from '@adapter/spi/ThemeSpi'
import { Theme, type Config, type Services } from '@domain/services/Theme'

export class ThemeMapper {
  static toService(drivers: Drivers, config: Config = {}, services: Services): Theme {
    const driver = drivers.theme(config)
    const spi = new ThemeSpi(driver)
    return new Theme(spi, services, config)
  }
}

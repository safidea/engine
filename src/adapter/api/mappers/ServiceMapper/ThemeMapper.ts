import type { Drivers } from '@adapter/spi/drivers'
import { ThemeSpi } from '@adapter/spi/drivers/ThemeSpi'
import { Theme, type Config, type Services } from '@domain/services/Theme'

export class ThemeMapper {
  static toService(drivers: Drivers, config: Config = {}, services: Services): Theme {
    const driver = drivers.theme(config)
    const spi = new ThemeSpi(driver)
    return new Theme(spi, services, config)
  }
}

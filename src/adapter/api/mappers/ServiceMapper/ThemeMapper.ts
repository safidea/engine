import type { Drivers } from '@adapter/spi/Drivers'
import { ThemeSpi } from '@adapter/spi/ThemeSpi'
import { Theme, type Services } from '@domain/services/Theme'
import type { Theme as Config } from '@adapter/api/configs/Services/Theme'

export class ThemeMapper {
  static toService(drivers: Drivers, services: Services, config: Config): Theme {
    const driver = drivers.theme(config)
    const spi = new ThemeSpi(driver)
    return new Theme(spi, services, config)
  }
}

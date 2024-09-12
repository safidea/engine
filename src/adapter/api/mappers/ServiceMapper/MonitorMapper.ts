import type { Drivers } from '@adapter/spi/Drivers'
import { MonitorSpi } from '@adapter/spi/MonitorSpi'
import { Monitor, type Config } from '@domain/services/Monitor'

interface Ressources {
  drivers: Drivers
}

export class MonitorMapper {
  static toService(ressources: Ressources, config: Config): Monitor {
    const { drivers } = ressources
    const driver = drivers.monitor(config)
    const spi = new MonitorSpi(driver)
    return new Monitor(spi, config)
  }
}

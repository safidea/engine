import type { Drivers } from '@adapter/spi/drivers'
import { MonitorSpi } from '@adapter/spi/drivers/MonitorSpi'
import { Monitor, type Config } from '@domain/services/Monitor'

export class MonitorMapper {
  static toService(drivers: Drivers, config: Config = []): Monitor {
    const driver = drivers.monitor(config)
    const spi = new MonitorSpi(driver)
    return new Monitor(spi, config)
  }
}

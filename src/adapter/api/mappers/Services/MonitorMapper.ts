import type { Drivers } from '@adapter/spi/drivers'
import { MonitorSpi } from '@adapter/spi/drivers/MonitorSpi'
import { Monitor, type MonitorsConfig } from '@domain/services/Monitor'

export class MonitorMapper {
  static toService(drivers: Drivers, config: MonitorsConfig = []): Monitor {
    const driver = drivers.monitor(config)
    const spi = new MonitorSpi(driver)
    return new Monitor(spi, config)
  }
}

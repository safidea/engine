import type { Drivers } from '@adapter/spi/Drivers'
import { ServerSpi } from '@adapter/spi/ServerSpi'
import { Server, type Config, type Services } from '@domain/services/Server'

export class ServerMapper {
  static toService(drivers: Drivers, config: Config = {}, services: Services) {
    const driver = drivers.server({ ...config, monitor: services.monitor.driver })
    const spi = new ServerSpi(driver)
    return new Server(spi, services, config)
  }
}

import type { Drivers } from '@adapter/spi/drivers'
import { ServerSpi } from '@adapter/spi/drivers/ServerSpi'
import { Server, type ServerConfig, type ServerServices } from '@domain/services/Server'

export class ServerMapper {
  static toService(drivers: Drivers, config: ServerConfig = {}, services: ServerServices) {
    const driver = drivers.server({ ...config, monitors: services.monitor.drivers })
    const spi = new ServerSpi(driver)
    return new Server(spi, services, config)
  }
}

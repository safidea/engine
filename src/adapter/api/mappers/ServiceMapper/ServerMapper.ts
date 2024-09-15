import type { Server as Config } from '@adapter/api/configs/Services/Server'
import type { Drivers } from '@adapter/spi/Drivers'
import { ServerSpi } from '@adapter/spi/ServerSpi'
import { Server, type Services } from '@domain/services/Server'

export class ServerMapper {
  static toService(drivers: Drivers, config: Config, services: Services) {
    const { port, sslCert, sslKey, env = 'development' } = config
    const driver = drivers.server({ port, sslCert, sslKey, env, monitor: services.monitor.driver })
    const spi = new ServerSpi(driver)
    return new Server(spi, services, { port, sslCert, sslKey, env })
  }
}

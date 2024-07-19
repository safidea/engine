import type { Server as Config } from '@adapter/api/configs/Services/Server'
import type { Drivers } from '@adapter/spi/Drivers'
import { ServerSpi } from '@adapter/spi/ServerSpi'
import { Logger } from '@domain/services/Logger'
import { Server } from '@domain/services/Server'

interface Ressources {
  drivers: Drivers
  logger: Logger
}

export class ServerMapper {
  static toService(ressources: Ressources, config: Config) {
    const { drivers, ...services } = ressources
    const { port, sslCert, sslKey, env = 'development' } = config
    const driver = drivers.server({ port, sslCert, sslKey, env })
    const spi = new ServerSpi(driver)
    return new Server(spi, services, { port, sslCert, sslKey, env })
  }
}

import type { Drivers } from '@adapter/spi/Drivers'
import { DatabaseSpi } from '@adapter/spi/DatabaseSpi'
import { Database, type Config } from '@domain/services/Database'
import type { Logger } from '@domain/services/Logger'

interface Ressources {
  drivers: Drivers
  logger: Logger
}

export class DatabaseMapper {
  static toService(ressources: Ressources, config: Partial<Config>): Database {
    const { drivers, ...services } = ressources
    const { url = `:memory:`, type = 'sqlite' } = config
    const driver = drivers.database({ url, type })
    const spi = new DatabaseSpi(driver)
    return new Database(spi, services, { url, type })
  }
}

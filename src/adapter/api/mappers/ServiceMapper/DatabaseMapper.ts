import type { Drivers } from '@adapter/spi/Drivers'
import { DatabaseSpi } from '@adapter/spi/DatabaseSpi'
import { Database, type Config } from '@domain/services/Database'
import type { Logger } from '@domain/services/Logger'
import type { Monitor } from '@domain/services/Monitor'

interface Ressources {
  drivers: Drivers
  logger: Logger
  monitor: Monitor
}

export class DatabaseMapper {
  static toService(ressources: Ressources, config: Partial<Config>): Database {
    const { drivers, ...services } = ressources
    const { url = `:memory:`, driver: driverName = 'SQLite' } = config
    const driver = drivers.database({ url, driver: driverName })
    const spi = new DatabaseSpi(driver)
    return new Database(spi, services, { url, driver: driverName })
  }
}

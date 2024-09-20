import type { Drivers } from '@adapter/spi/Drivers'
import { DatabaseSpi } from '@adapter/spi/DatabaseSpi'
import { Database, type Config, type Services } from '@domain/services/Database'

export class DatabaseMapper {
  static toService(
    drivers: Drivers,
    config: Config = { url: `:memory:`, driver: 'SQLite' },
    services: Services
  ): Database {
    const driver = drivers.database(config)
    const spi = new DatabaseSpi(driver)
    return new Database(spi, services, config)
  }
}

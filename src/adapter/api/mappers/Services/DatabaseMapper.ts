import type { Drivers } from '@adapter/spi/drivers'
import { DatabaseSpi } from '@adapter/spi/drivers/DatabaseSpi'
import { Database, type DatabaseConfig, type DatabaseServices } from '@domain/services/Database'

export class DatabaseMapper {
  static toService(
    drivers: Drivers,
    config: DatabaseConfig = { url: `:memory:`, driver: 'SQLite' },
    services: DatabaseServices
  ): Database {
    const driver = drivers.database(config)
    const spi = new DatabaseSpi(driver)
    return new Database(spi, services, config)
  }
}

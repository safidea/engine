import type { Drivers } from '@adapter/spi/Drivers'
import { DatabaseSpi } from '@adapter/spi/DatabaseSpi'
import { Database, type Config, type Services } from '@domain/services/Database'

export class DatabaseMapper {
  static toService(drivers: Drivers, services: Services, config: Partial<Config>): Database {
    const { url = `:memory:`, driver: driverName = 'SQLite' } = config
    const driver = drivers.database({ url, driver: driverName })
    const spi = new DatabaseSpi(driver)
    return new Database(spi, services, { url, driver: driverName })
  }
}

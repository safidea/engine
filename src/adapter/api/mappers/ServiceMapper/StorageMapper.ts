import type { Drivers } from '@adapter/spi/Drivers'
import { StorageSpi } from '@adapter/spi/StorageSpi'
import { Storage } from '@domain/services/Storage'
import type { Logger } from '@domain/services/Logger'
import type { Database } from '@domain/services/Database'

interface Ressources {
  drivers: Drivers
  logger: Logger
  database: Database
}

export class StorageMapper {
  static toService(ressources: Ressources): Storage {
    const { drivers, database, logger } = ressources
    const driver = drivers.storage(database)
    const spi = new StorageSpi(driver)
    return new Storage(spi, { logger })
  }
}

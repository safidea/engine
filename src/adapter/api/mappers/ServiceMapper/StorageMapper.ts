import type { Drivers } from '@adapter/spi/Drivers'
import { StorageSpi } from '@adapter/spi/StorageSpi'
import { Storage } from '@domain/services/Storage'
import type { Logger } from '@domain/services/Logger'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'

interface Ressources {
  drivers: Drivers
  logger: Logger
  server: Server
  database: Database
}

export class StorageMapper {
  static toService(ressources: Ressources): Storage {
    const { drivers, database, server, logger } = ressources
    const driver = drivers.storage(database)
    const spi = new StorageSpi(driver, { server })
    return new Storage(spi, { logger })
  }
}

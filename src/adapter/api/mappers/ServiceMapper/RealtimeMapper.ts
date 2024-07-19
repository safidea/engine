import type { Drivers } from '@adapter/spi/Drivers'
import { RealtimeSpi } from '@adapter/spi/RealtimeSpi'
import { Realtime } from '@domain/services/Realtime'
import type { Logger } from '@domain/services/Logger'
import type { Database } from '@domain/services/Database'
import type { IdGenerator } from '@domain/services/IdGenerator'

interface Ressources {
  drivers: Drivers
  logger: Logger
  database: Database
  idGenerator: IdGenerator
}

export class RealtimeMapper {
  static toService(ressources: Ressources): Realtime {
    const { drivers, database, ...services } = ressources
    const driver = drivers.realtime(database.config)
    const spi = new RealtimeSpi(driver)
    return new Realtime(spi, services)
  }
}

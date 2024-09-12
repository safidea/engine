import type { Drivers } from '@adapter/spi/Drivers'
import { QueueSpi } from '@adapter/spi/QueueSpi'
import { Queue } from '@domain/services/Queue'
import type { Logger } from '@domain/services/Logger'
import type { Database } from '@domain/services/Database'
import type { Monitor } from '@domain/services/Monitor'

interface Ressources {
  drivers: Drivers
  logger: Logger
  database: Database
  monitor: Monitor
}

export class QueueMapper {
  static toService(ressources: Ressources): Queue {
    const { drivers, database, ...services } = ressources
    const driver = drivers.queue(database)
    const spi = new QueueSpi(driver)
    return new Queue(spi, services)
  }
}

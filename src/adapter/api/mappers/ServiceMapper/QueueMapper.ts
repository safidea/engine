import type { Drivers } from '@adapter/spi/Drivers'
import { QueueSpi } from '@adapter/spi/QueueSpi'
import { Queue } from '@domain/services/Queue'
import type { Logger } from '@domain/services/Logger'
import type { Database } from '@domain/services/Database'

interface Ressources {
  drivers: Drivers
  logger: Logger
  database: Database
}

export class QueueMapper {
  static toService(ressources: Ressources): Queue {
    const { drivers, database, ...services } = ressources
    const driver = drivers.queue(database)
    const spi = new QueueSpi(driver)
    return new Queue(spi, services)
  }
}

import type { Drivers } from '@adapter/spi/drivers'
import { QueueSpi } from '@adapter/spi/drivers/QueueSpi'
import { Queue, type QueueServices } from '@domain/services/Queue'

export class QueueMapper {
  static toService(drivers: Drivers, services: QueueServices): Queue {
    const driver = drivers.queue(services.database)
    const spi = new QueueSpi(driver)
    return new Queue(spi, services)
  }
}

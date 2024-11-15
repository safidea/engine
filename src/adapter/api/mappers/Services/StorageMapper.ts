import type { Drivers } from '@adapter/spi/drivers'
import { StorageSpi } from '@adapter/spi/drivers/StorageSpi'
import { Storage, type StorageServices } from '@domain/services/Storage'

export class StorageMapper {
  static toService(drivers: Drivers, services: StorageServices): Storage {
    const driver = drivers.storage(services.database)
    const spi = new StorageSpi(driver)
    return new Storage(spi, services)
  }
}

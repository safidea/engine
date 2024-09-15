import type { Drivers } from '@adapter/spi/Drivers'
import { StorageSpi } from '@adapter/spi/StorageSpi'
import { Storage, type Services } from '@domain/services/Storage'

export class StorageMapper {
  static toService(drivers: Drivers, services: Services): Storage {
    const driver = drivers.storage(services.database)
    const spi = new StorageSpi(driver)
    return new Storage(spi, services)
  }
}

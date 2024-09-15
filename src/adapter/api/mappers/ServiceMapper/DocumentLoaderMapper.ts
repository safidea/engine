import type { Drivers } from '@adapter/spi/Drivers'
import { DocumentLoaderSpi } from '@adapter/spi/DocumentLoaderSpi'
import { DocumentLoader, type Services } from '@domain/services/DocumentLoader'

export class DocumentLoaderMapper {
  static toService(drivers: Drivers, services: Services): DocumentLoader {
    const driver = drivers.documentLoader()
    const spi = new DocumentLoaderSpi(driver)
    return new DocumentLoader(spi, services)
  }
}

import type { Drivers } from '@adapter/spi/drivers'
import { DocumentLoaderSpi } from '@adapter/spi/drivers/DocumentLoaderSpi'
import { DocumentLoader, type DocumentLoaderServices } from '@domain/services/DocumentLoader'

export class DocumentLoaderMapper {
  static toService(drivers: Drivers, services: DocumentLoaderServices): DocumentLoader {
    const driver = drivers.documentLoader()
    const spi = new DocumentLoaderSpi(driver)
    return new DocumentLoader(spi, services)
  }
}

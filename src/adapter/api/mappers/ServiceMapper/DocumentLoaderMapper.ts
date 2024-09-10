import type { Drivers } from '@adapter/spi/Drivers'
import { DocumentLoaderSpi } from '@adapter/spi/DocumentLoaderSpi'
import { DocumentLoader } from '@domain/services/DocumentLoader'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Ressources {
  drivers: Drivers
  templateCompiler: TemplateCompiler
}

export class DocumentLoaderMapper {
  static toService(ressources: Ressources): DocumentLoader {
    const { drivers, ...services } = ressources
    const driver = drivers.documentLoader()
    const spi = new DocumentLoaderSpi(driver)
    return new DocumentLoader(spi, services)
  }
}

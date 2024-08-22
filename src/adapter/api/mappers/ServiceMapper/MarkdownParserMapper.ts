import type { Drivers } from '@adapter/spi/Drivers'
import { MarkdownParserSpi } from '@adapter/spi/MarkdownParserSpi'
import type { ReactComponents } from '@domain/entities/Component'
import { MarkdownParser } from '@domain/services/MarkdownParser'
import type { React } from '@domain/services/React'

interface Ressources {
  drivers: Drivers
  react: React
  components: ReactComponents
}

export class MarkdownParserMapper {
  static toService(ressources: Ressources): MarkdownParser {
    const { drivers, ...services } = ressources
    const driver = drivers.markdownParser()
    const spi = new MarkdownParserSpi(driver)
    return new MarkdownParser(spi, services)
  }
}

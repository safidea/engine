import type { Drivers } from '@adapter/spi/Drivers'
import { MarkdownParserSpi } from '@adapter/spi/MarkdownParserSpi'
import { MarkdownParser, type Services } from '@domain/services/MarkdownParser'

export class MarkdownParserMapper {
  static toService(drivers: Drivers, services: Services): MarkdownParser {
    const driver = drivers.markdownParser()
    const spi = new MarkdownParserSpi(driver)
    return new MarkdownParser(spi, services)
  }
}

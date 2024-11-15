import type { Drivers } from '@adapter/spi/drivers'
import { MarkdownParserSpi } from '@adapter/spi/drivers/MarkdownParserSpi'
import { MarkdownParser, type MarkdownParserServices } from '@domain/services/MarkdownParser'

export class MarkdownParserMapper {
  static toService(drivers: Drivers, services: MarkdownParserServices): MarkdownParser {
    const driver = drivers.markdownParser()
    const spi = new MarkdownParserSpi(driver)
    return new MarkdownParser(spi, services)
  }
}

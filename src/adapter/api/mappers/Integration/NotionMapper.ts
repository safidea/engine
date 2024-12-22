import type { Integrations } from '@adapter/spi/integrations'
import { NotionSpi } from '@adapter/spi/integrations/NotionSpi'
import { Notion, type NotionConfig, type NotionServices } from '@domain/integrations/Notion'

export class NotionMapper {
  static toIntegration(
    integrations: Integrations,
    services: NotionServices,
    config?: NotionConfig
  ): Notion {
    const driver = integrations.notion(config)
    const spi = new NotionSpi(driver)
    return new Notion(spi, services)
  }
}

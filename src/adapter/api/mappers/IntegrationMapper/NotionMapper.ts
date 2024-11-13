import type { Integrations } from '@adapter/spi/integrations'
import { NotionSpi } from '@adapter/spi/integrations/NotionSpi'
import { Notion, type Config, type Services } from '@domain/integrations/Notion'

export class NotionMapper {
  static toIntegration(integrations: Integrations, services: Services, config?: Config): Notion {
    const driver = integrations.notion(config)
    const spi = new NotionSpi(driver)
    return new Notion(spi, services)
  }
}

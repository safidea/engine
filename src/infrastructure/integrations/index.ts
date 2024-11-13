import type { Integrations } from '@adapter/spi/integrations'
import type { Config as NotionConfig } from '@domain/integrations/Notion'

import { NotionIntegration } from './NotionIntegration'

export const integrations: Integrations = {
  notion: (config?: NotionConfig) => new NotionIntegration(config),
}

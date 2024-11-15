import type { Integrations } from '@adapter/spi/integrations'
import type { NotionConfig } from '@domain/integrations/Notion'
import type { PappersConfig } from '@domain/integrations/Pappers'

import { NotionIntegration } from './NotionIntegration'
import { PappersIntegration } from './PappersIntegration'

export const integrations: Integrations = {
  notion: (config?: NotionConfig) => new NotionIntegration(config),
  pappers: (config?: PappersConfig) => new PappersIntegration(config),
}

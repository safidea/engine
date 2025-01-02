import type { Integrations } from '@adapter/spi/integrations'
import type { NotionConfig } from '@domain/integrations/Notion'
import type { PappersConfig } from '@domain/integrations/Pappers'
import type { QontoConfig } from '@domain/integrations/Qonto'
import type { NgrokConfig } from '@domain/integrations/Ngrok'

import { NotionBunIntegration } from './NotionIntegration'
import { PappersBunIntegration } from './PappersIntegration'
import { QontoBunIntegration } from './QontoIntegration'
import { NgrokBunIntegration } from './NgrokIntegration'

export const mocks: Integrations = {
  notion: (config?: NotionConfig) => new NotionBunIntegration(config),
  pappers: (config?: PappersConfig) => new PappersBunIntegration(config),
  qonto: (config?: QontoConfig) => new QontoBunIntegration(config),
  ngrok: (config?: NgrokConfig) => new NgrokBunIntegration(config),
}

import type { Integrations } from '@adapter/spi/integrations'
import type { NotionConfig } from '@domain/integrations/Notion'
import type { PappersConfig } from '@domain/integrations/Pappers'
import type { QontoConfig } from '@domain/integrations/Qonto'
import type { NgrokConfig } from '@domain/integrations/Ngrok'

import { NotionIntegration } from '../NotionIntegration'
import { PappersBunIntegration } from './PappersBunIntegration'
import { QontoBunIntegration } from './QontoBunIntegration'
import { NgrokBunIntegration } from './NgrokBunIntegration'

export const integrations: Integrations = {
  notion: (config?: NotionConfig) => new NotionIntegration(config),
  pappers: (config?: PappersConfig) => new PappersBunIntegration(config),
  qonto: (config?: QontoConfig) => new QontoBunIntegration(config),
  ngrok: (config?: NgrokConfig) => new NgrokBunIntegration(config),
}

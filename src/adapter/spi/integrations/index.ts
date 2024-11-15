import type { NotionConfig } from '@domain/integrations/Notion'
import type { PappersConfig } from '@domain/integrations/Pappers'

import type { IPappersIntegration } from './PappersSpi'
import type { INotionIntegration } from './NotionSpi'

export interface Integrations {
  notion: (config?: NotionConfig) => INotionIntegration
  pappers: (config?: PappersConfig) => IPappersIntegration
}

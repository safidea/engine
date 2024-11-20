import type { NotionConfig } from '@domain/integrations/Notion'
import type { PappersConfig } from '@domain/integrations/Pappers'
import type { QontoConfig } from '@domain/integrations/Qonto'

import type { IPappersIntegration } from './PappersSpi'
import type { INotionIntegration } from './NotionSpi'
import type { IQontoIntegration } from './QontoSpi'

export interface Integrations {
  notion: (config?: NotionConfig) => INotionIntegration
  pappers: (config?: PappersConfig) => IPappersIntegration
  qonto: (config?: QontoConfig) => IQontoIntegration
}

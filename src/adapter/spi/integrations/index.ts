import type { Integration as NotionIntegration } from './NotionSpi'
import type { Config as NotionConfig } from '@domain/integrations/Notion'

export interface Integrations {
  notion: (config?: NotionConfig) => NotionIntegration
}

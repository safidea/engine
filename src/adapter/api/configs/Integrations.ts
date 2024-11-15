import type { NotionConfig } from '@domain/integrations/Notion'
import type { PappersConfig } from '@domain/integrations/Pappers'

export interface IIntegrations {
  notion?: NotionConfig
  pappers?: PappersConfig
}

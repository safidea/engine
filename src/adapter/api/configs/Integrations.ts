import type { NotionConfig } from '@domain/integrations/Notion'
import type { PappersConfig } from '@domain/integrations/Pappers'
import type { QontoConfig } from '@domain/integrations/Qonto'

export interface IIntegrations {
  notion?: NotionConfig
  pappers?: PappersConfig
  qonto?: QontoConfig
}

import type { Integration as NotionIntegration } from './NotionSpi'

export interface Integrations {
  notion: () => NotionIntegration
}

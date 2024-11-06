import type { Config } from '@domain/entities/Trigger/notion/PageCreated'

export interface PageCreated extends Omit<Config, 'automation'> {
  integration: 'Notion'
  event: 'PageCreated'
}

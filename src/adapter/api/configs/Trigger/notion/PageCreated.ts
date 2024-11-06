import type { Config } from '@domain/entities/Trigger/notion/PageCreated'

export interface PageCreated extends Omit<Config, 'automation'> {
  service: 'Notion'
  event: 'PageCreated'
}

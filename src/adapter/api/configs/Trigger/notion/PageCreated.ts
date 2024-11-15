import type { PageCreatedNotionTriggerConfig } from '@domain/entities/Trigger/notion/PageCreated'

export interface IPageCreatedNotionTrigger
  extends Omit<PageCreatedNotionTriggerConfig, 'automation'> {
  integration: 'Notion'
  event: 'PageCreated'
}

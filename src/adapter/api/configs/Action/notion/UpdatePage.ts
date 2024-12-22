import type { UpdatePageNotionActionConfig } from '@domain/entities/Action/notion/UpdatePage'

export interface IUpdatePageNotionAction extends UpdatePageNotionActionConfig {
  integration: 'Notion'
  action: 'UpdatePage'
}

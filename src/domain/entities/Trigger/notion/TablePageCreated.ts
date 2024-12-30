import type { Queue } from '@domain/services/Queue'
import type { BaseTrigger, BaseTriggerConfig } from '../base'
import type { AutomationContext } from '../../Automation/Context'
import type { Notion } from '@domain/integrations/Notion'
import { NotionTablePage } from '@domain/integrations/Notion/NotionTablePage'

export interface TablePageCreatedNotionTriggerConfig extends BaseTriggerConfig {
  automation: string
  table: string
}

export interface TablePageCreatedNotionTriggerServices {
  queue: Queue
}

export interface TablePageCreatedNotionTriggerIntegrations {
  notion: Notion
}

export class TablePageCreatedNotionTrigger implements BaseTrigger {
  constructor(
    private _config: TablePageCreatedNotionTriggerConfig,
    private _services: TablePageCreatedNotionTriggerServices,
    private _integrations: TablePageCreatedNotionTriggerIntegrations
  ) {
    _integrations.notion.getConfig()
  }

  init = async (run: (triggerData: object) => Promise<AutomationContext>) => {
    const { queue } = this._services
    const { automation, table: tableId } = this._config
    const { notion } = this._integrations
    const table = await notion.getTable(tableId)
    table.onInsert(this.onTablePageCreated)
    queue.job(automation, run)
  }

  onTablePageCreated = async (page: NotionTablePage) => {
    const { queue } = this._services
    const { automation } = this._config
    await queue.add(automation, {
      ...page.properties,
      id: page.id,
      created_time: page.created_time,
    })
  }
}

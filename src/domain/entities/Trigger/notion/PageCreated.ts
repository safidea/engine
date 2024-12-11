import type { Queue } from '@domain/services/Queue'
import type { BaseTrigger, BaseTriggerConfig } from '../base'
import type { AutomationContext } from '../../Automation/Context'
import type { Notion } from '@domain/integrations/Notion'
import type { NotionTablePage } from '@domain/integrations/NotionTable'

export interface PageCreatedNotionTriggerConfig extends BaseTriggerConfig {
  automation: string
  table: string
}

export interface PageCreatedNotionTriggerServices {
  queue: Queue
}

export interface PageCreatedNotionTriggerIntegrations {
  notion: Notion
}

export class PageCreatedNotionTrigger implements BaseTrigger {
  constructor(
    private _config: PageCreatedNotionTriggerConfig,
    private _services: PageCreatedNotionTriggerServices,
    private _integrations: PageCreatedNotionTriggerIntegrations
  ) {
    _integrations.notion.getConfig()
  }

  init = async (run: (triggerData: object) => Promise<AutomationContext>) => {
    const { queue } = this._services
    const { automation, table: tableId } = this._config
    const { notion } = this._integrations
    const table = await notion.getTable(tableId)
    table.onPageCreated(this.onPageCreated)
    queue.job(automation, run)
  }

  onPageCreated = async (page: NotionTablePage) => {
    const { queue } = this._services
    const { automation } = this._config
    await queue.add(automation, page)
  }
}

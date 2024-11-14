import type { Queue } from '@domain/services/Queue'
import type { Base, BaseConfig } from '../base'
import type { Context } from '../../Automation/Context'
import type { Notion } from '@domain/integrations/Notion'
import type { NotionTablePage } from '@domain/integrations/NotionTable'

export interface Config extends BaseConfig {
  automation: string
  tableId: string
}

export interface Services {
  queue: Queue
}

export interface Integrations {
  notion: Notion
}

export class PageCreated implements Base {
  constructor(
    private _config: Config,
    private _services: Services,
    private _integrations: Integrations
  ) {
    _integrations.notion.config()
  }

  init = async (run: (triggerData: object) => Promise<Context>) => {
    const { queue } = this._services
    const { automation, tableId } = this._config
    const { notion } = this._integrations
    const table = await notion.table(tableId)
    table.onPageCreated(this.onPageCreated)
    queue.job(automation, run)
  }

  onPageCreated = async (page: NotionTablePage) => {
    const { queue } = this._services
    const { automation } = this._config
    await queue.add(automation, page)
  }
}

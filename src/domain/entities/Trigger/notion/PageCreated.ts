import type { PersistedRecord } from '@domain/entities/Record/Persisted'
import type { Queue } from '@domain/services/Queue'
import type { Base, BaseConfig } from '../base'
import type { Context } from '../../Automation/Context'

export interface Config extends BaseConfig {
  automation: string
  tableId: string
}

export interface Services {
  queue: Queue
}

export class PageCreated implements Base {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  init = async (run: (triggerData: object) => Promise<Context>) => {
    const { queue } = this._services
    const { automation } = this._config
    queue.job(automation, run)
  }

  onNewPage = async (record: PersistedRecord) => {
    const { queue } = this._services
    const { automation } = this._config
    await queue.add(automation, record.toJson())
  }
}

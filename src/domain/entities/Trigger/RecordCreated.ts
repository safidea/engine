import type { PersistedRecord } from '@domain/entities/Record/Persisted'
import type { Queue } from '@domain/services/Queue'
import type { Realtime } from '@domain/services/Realtime'
import type { Base, BaseConfig } from './base'
import type { Context } from '../Automation/Context'

export interface Config extends BaseConfig {
  automation: string
  table: string
}

export interface Services {
  realtime: Realtime
  queue: Queue
}

export class RecordCreated implements Base {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  init = async (run: (triggerData: object) => Promise<Context>) => {
    const { realtime, queue } = this._services
    const { table, automation } = this._config
    queue.job(automation, run)
    realtime.onInsert(table, this.onInsert)
  }

  onInsert = async (record: PersistedRecord) => {
    const { queue } = this._services
    const { automation } = this._config
    await queue.add(automation, record.toJson())
  }
}

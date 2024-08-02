import type { Persisted } from '@domain/entities/Record/Persisted'
import type { Queue } from '@domain/services/Queue'
import type { Realtime } from '@domain/services/Realtime'
import type { Base } from './base'
import type { Context } from '../Automation/Context'

interface Config {
  automation: string
  table: string
}

interface Services {
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

  onInsert = async (record: Persisted) => {
    const { queue } = this._services
    const { automation } = this._config
    await queue.add(automation, record.data)
  }
}

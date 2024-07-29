import type { Persisted } from '@domain/entities/Record/Persisted'
import type { Queue } from '@domain/services/Queue'
import type { Realtime } from '@domain/services/Realtime'

interface Config {
  automation: string
  table: string
}

interface Services {
  realtime: Realtime
  queue: Queue
}

export class RecordCreated {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  init = async () => {
    const { realtime } = this._services
    const { table } = this._config
    realtime.onInsert(table, this.onInsert)
  }

  onInsert = async (record: Persisted) => {
    const { queue } = this._services
    const { automation } = this._config
    await queue.add(automation, record.data)
  }
}

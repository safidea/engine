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
    private config: Config,
    private services: Services
  ) {}

  init = async () => {
    const { realtime } = this.services
    const { table } = this.config
    realtime.onInsert(table, this.onInsert)
  }

  onInsert = async (record: Persisted) => {
    const { queue } = this.services
    const { automation } = this.config
    await queue.add(automation, record.data)
  }
}

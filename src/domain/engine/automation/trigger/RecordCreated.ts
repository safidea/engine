import type { Persisted } from '@domain/entities/record/Persisted'
import type { Queue } from '@domain/services/Queue'
import type { Realtime } from '@domain/services/Realtime'

interface Params {
  automation: string
  table: string
  realtime: Realtime
  queue: Queue
}

export class RecordCreated {
  constructor(private params: Params) {
    const { realtime, table } = params
    realtime.onInsert(table, this.onInsert)
  }

  onInsert = async (record: Persisted) => {
    const { automation, queue } = this.params
    await queue.add(automation, record.data)
  }
}

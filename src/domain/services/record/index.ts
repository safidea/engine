import type { IdGenerator } from '../IdGenerator'
import { PersistedRecord, type PersistedRecordData } from './PersistedRecord'
import { ToCreateRecord, type ToCreateRecordData } from './ToCreateRecord'

export class Record {
  constructor(private params: { idGenerator: IdGenerator }) {}

  create(data: ToCreateRecordData) {
    return new ToCreateRecord(data, this.params)
  }

  persist(data: PersistedRecordData) {
    return new PersistedRecord(data)
  }
}

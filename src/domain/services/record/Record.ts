import type { IdGenerator } from '../idGenerator/IdGenerator'
import { PersistedRecord } from './persisted/PersistedRecord'
import type { PersistedRecordDto } from './persisted/PersistedRecordDto'
import { RecordToCreate } from './toCreate/RecordToCreate'
import type { RecordToCreateDto } from './toCreate/RecordToCreateDto'

export class Record {
  constructor(private params: { idGenerator: IdGenerator }) {}

  create(dto: RecordToCreateDto) {
    return new RecordToCreate(dto, this.params)
  }

  persist(dto: PersistedRecordDto) {
    return new PersistedRecord(dto)
  }
}

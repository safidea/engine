import { PersistedRecord } from '@domain/services/record/PersistedRecord'
import type { ToCreateRecord } from '@domain/services/record/ToCreateRecord'
import type { PersistedRecordDto } from '../dtos/PersistedRecordDto'
import type { ToCreateRecordDto } from '../dtos/ToCreateRecordDto'

export class RecordMapper {
  static toCreateDto = (toCreateRecord: ToCreateRecord): ToCreateRecordDto => {
    return toCreateRecord.data
  }

  static toPersistedEntity = (record: PersistedRecordDto) => {
    return new PersistedRecord(record)
  }
}

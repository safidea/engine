import type { CreatedRecord } from '@domain/entities/Record/Created'
import type { RecordFieldsDto } from '../dtos/RecordDto'
import type { UpdatedRecord } from '@domain/entities/Record/Updated'
import { PersistedRecord } from '@domain/entities/Record/Persisted'

export class RecordMapper {
  static toDto = (record: CreatedRecord | UpdatedRecord): RecordFieldsDto => {
    return record.fields
  }

  static toEntity = (record: RecordFieldsDto) => {
    return new PersistedRecord(record)
  }

  static toManyEntity = (records: RecordFieldsDto[]) => {
    return records.map((record) => new PersistedRecord(record))
  }
}

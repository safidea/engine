import type { PersistedRecordFieldsDto } from '../dtos/RecordDto'
import { Record } from '@domain/entities/Record'

export class RecordMapper {
  static toEntity = (record: PersistedRecordFieldsDto) => {
    const { id, created_at, updated_at, ...fields } = record
    return new Record(id, fields, created_at, updated_at)
  }

  static toManyEntity = (records: PersistedRecordFieldsDto[]) => {
    return records.map(this.toEntity)
  }
}

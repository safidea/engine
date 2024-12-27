import type { PersistedRecordFieldsDto } from '../dtos/RecordDto'
import { Record, type RecordFields } from '@domain/entities/Record'

export class RecordMapper {
  static toEntity = <T extends RecordFields>(record: PersistedRecordFieldsDto<T>) => {
    const { id, created_at, updated_at, fields } = record
    return new Record<T>(id, fields, created_at, updated_at)
  }

  static toManyEntity = <T extends RecordFields>(records: PersistedRecordFieldsDto<T>[]) => {
    return records.map(this.toEntity<T>)
  }
}

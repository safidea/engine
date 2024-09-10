import type { CreatedRecord } from '@domain/entities/Record/Created'
import type { CreatedRecordDto, PersistedRecordDto, UpdatedRecordDto } from '../dtos/RecordDto'
import type { UpdatedRecord } from '@domain/entities/Record/Updated'
import { PersistedRecord } from '@domain/entities/Record/Persisted'

export class RecordMapper {
  static toCreateDto = (createdRecord: CreatedRecord): CreatedRecordDto => {
    return createdRecord.fields
  }

  static toUpdateDto = (updatedRecord: UpdatedRecord): UpdatedRecordDto => {
    return updatedRecord.fields
  }

  static toPersistedEntity = (record: PersistedRecordDto) => {
    return new PersistedRecord(record)
  }

  static toManyPersistedEntity = (records: PersistedRecordDto[]) => {
    return records.map((record) => new PersistedRecord(record))
  }
}

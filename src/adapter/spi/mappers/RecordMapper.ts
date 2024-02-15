import { Persisted } from '@domain/entities/record/Persisted'
import type { ToCreate } from '@domain/entities/record/ToCreate'
import type { PersistedDto, ToCreateDto, ToUpdateDto } from '../dtos/RecordDto'
import type { ToUpdate } from '@domain/entities/record/ToUpdate'

export class RecordMapper {
  static toCreateDto = (toCreateRecord: ToCreate): ToCreateDto => {
    return toCreateRecord.data
  }

  static toUpdateDto = (toUpdateRecord: ToUpdate): ToUpdateDto => {
    return toUpdateRecord.data
  }

  static toPersistedEntity = (record: PersistedDto) => {
    return new Persisted(record)
  }

  static toManyPersistedEntity = (records: PersistedDto[]) => {
    return records.map((record) => new Persisted(record))
  }
}

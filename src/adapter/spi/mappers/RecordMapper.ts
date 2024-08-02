import { Persisted } from '@domain/entities/Record/Persisted'
import { ToCreate } from '@domain/entities/Record/ToCreate'
import type { PersistedDto, ToCreateDto, ToUpdateDto } from '../dtos/RecordDto'
import type { ToUpdate } from '@domain/entities/Record/ToUpdate'

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

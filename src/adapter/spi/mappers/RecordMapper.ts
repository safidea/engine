import { Persisted } from '@domain/entities/record/Persisted'
import type { ToCreate } from '@domain/entities/record/ToCreate'
import type { PersistedDto, ToCreateDto } from '../dtos/RecordDto'

export class RecordMapper {
  static toCreateDto = (toCreateRecord: ToCreate): ToCreateDto => {
    return toCreateRecord.data
  }

  static toPersistedEntity = (record: PersistedDto) => {
    return new Persisted(record)
  }
}

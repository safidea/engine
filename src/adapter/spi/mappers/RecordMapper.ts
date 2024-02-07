import { Persisted } from '@domain/services/record/Persisted'
import type { ToCreate } from '@domain/services/record/ToCreate'
import type { PersistedDto, ToCreateDto } from '../dtos/RecordDto'

export class RecordMapper {
  static toCreateDto = (toCreateRecord: ToCreate): ToCreateDto => {
    return toCreateRecord.data
  }

  static toPersistedService = (record: PersistedDto) => {
    return new Persisted(record)
  }
}

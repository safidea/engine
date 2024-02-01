import { Persisted } from '@domain/services/Record/Persisted'
import type { ToCreate } from '@domain/services/Record/ToCreate'
import type { PersistedDto, ToCreateDto } from '../dtos/RecordDto'

export class RecordMapper {
  static toCreateDto = (toCreateRecord: ToCreate): ToCreateDto => {
    return toCreateRecord.data
  }

  static toPersistedService = (record: PersistedDto) => {
    return new Persisted(record)
  }
}

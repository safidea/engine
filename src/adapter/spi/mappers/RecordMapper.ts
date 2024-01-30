import { PersistedRecord } from '@domain/services/record/persisted/PersistedRecord'
import type { RecordToCreate } from '@domain/services/record/toCreate/RecordToCreate'
import type { RecordDto } from '@adapter/spi/dtos/RecordDto'

export class RecordMapper {
  static toCreateDto(recordToCreate: RecordToCreate): RecordDto {
    return recordToCreate.data
  }

  static toPersistedEntity(record: RecordDto) {
    return new PersistedRecord(record)
  }
}

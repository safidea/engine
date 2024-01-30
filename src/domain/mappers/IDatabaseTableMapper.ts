import type { PersistedRecord } from '@domain/services/record/persisted/PersistedRecord'
import type { RecordToCreate } from '@domain/services/record/toCreate/RecordToCreate'

export interface IDatabaseTableMapper {
  insert: (recordToCreate: RecordToCreate) => Promise<PersistedRecord>
}

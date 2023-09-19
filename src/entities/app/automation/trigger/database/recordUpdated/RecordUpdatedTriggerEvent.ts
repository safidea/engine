import { PersistedRecordDataWithLinkedRecordsData } from '@entities/services/database/record/state/persisted/PersistedRecordData'

export interface RecordUpdatedTriggerEvent {
  event: 'record_updated'
  context: {
    table: string
    record: PersistedRecordDataWithLinkedRecordsData
    updatedFields: string[]
  }
}

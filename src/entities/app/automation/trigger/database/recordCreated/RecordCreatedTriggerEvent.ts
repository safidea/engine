import { PersistedRecordDataWithLinkedRecordsData } from '@entities/services/database/record/state/persisted/PersistedRecordData'

export interface RecordCreatedTriggerEvent {
  event: 'record_created'
  context: {
    table: string
    record: PersistedRecordDataWithLinkedRecordsData
  }
}

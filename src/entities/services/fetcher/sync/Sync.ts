import { Table } from '@entities/app/table/Table'
import { Filter } from '@entities/services/database/filter/Filter'
import { PersistedRecord } from '../../database/record/state/persisted/PersistedRecord'
import { RecordToPersite } from '@entities/services/database/record/Record'

export interface SyncResource {
  table: Table
  filters?: Filter[]
}

export interface Sync {
  resources: SyncResource[]
  records: RecordToPersite[]
}

export interface SyncRecordsByTable {
  [key: string]: PersistedRecord[]
}

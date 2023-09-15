import { Table } from '@entities/app/table/Table'
import { Filter } from '@entities/services/database/filter/Filter'
import { FilterParams } from '@entities/services/database/filter/FilterParams'
import { RecordData } from '@entities/services/database/record/RecordData'
import { PersistedRecord } from '../database/record/state/persisted/PersistedRecord'
import { RecordToDeleteData } from '../database/record/state/toDelete/RecordToDeleteData'
import { RecordToUpdateData } from '../database/record/state/toUpdate/RecordToUpdateData'

export interface FetcherSyncResource {
  table: Table
  filters?: Filter[]
}

export interface FetcherSyncResourceParams {
  table: string
  filters?: FilterParams[]
}

export interface FetcherSyncTablesRecordsData {
  [key: string]: RecordData[]
}

export interface FetcherSyncTablesRecords {
  [key: string]: PersistedRecord[]
}

export interface FetcherSyncCommand {
  action: 'toCreate' | 'toUpdate' | 'toDelete'
  table: string
  record: RecordData | RecordToUpdateData | RecordToDeleteData
}

export interface FetcherSync {
  commands?: FetcherSyncCommand[]
  resources?: FetcherSyncResourceParams[]
}

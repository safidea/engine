import { SyncResource, SyncTablesRecords } from './sync/Sync'
import { RecordToPersite } from '../database/record/Record'

export interface IFetcherService {
  getSyncRecordsHook: (resources: SyncResource[]) => () => {
    tables: SyncTablesRecords
    error?: string
    isLoading: boolean
  }
  getSyncRecordsFunction: () => (options: {
    records?: RecordToPersite[]
    resources?: SyncResource[]
  }) => Promise<{ error?: string; tables: SyncTablesRecords }>
}

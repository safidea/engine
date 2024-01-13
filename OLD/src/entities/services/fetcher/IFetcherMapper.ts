import { SyncResource, SyncRecordsByTable } from './sync/Sync'
import { RecordToPersite } from '../database/record/Record'
import { FetcherDrivers } from './FetcherDrivers'

export interface IFetcherMapper {
  driverName: FetcherDrivers
  getSyncRecordsHook: (resources: SyncResource[]) => () => {
    tables: SyncRecordsByTable
    error?: string
    isLoading: boolean
  }
  getSyncRecordsFunction: () => (options: {
    records?: RecordToPersite[]
    resources?: SyncResource[]
  }) => Promise<{ error?: string; tables: SyncRecordsByTable }>
}

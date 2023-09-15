import { FetcherSyncResource, FetcherSyncTablesRecords } from './FetcherSync'
import { Record } from '../database/record/Record'

export interface IFetcherService {
  getSyncRecordsHook: (resources: FetcherSyncResource[]) => () => {
    tables: FetcherSyncTablesRecords
    error?: string
    isLoading: boolean
  }
  getSyncRecordsFunction: () => (options: {
    records: Record[]
    resources: FetcherSyncResource[]
  }) => Promise<{ error?: string; tables: FetcherSyncTablesRecords }>
}

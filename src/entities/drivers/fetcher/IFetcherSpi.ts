import { Record } from '@entities/drivers/database/record/Record'
import { SyncResource, SyncTables } from '@entities/drivers/database/sync/Sync'

export interface IFetcherSpi {
  getSyncRecordsHook: (resources: SyncResource[]) => () => {
    tables: SyncTables
    error?: string
    isLoading: boolean
  }
  getSyncRecordsFunction: () => (options: {
    records?: Record[]
    resources?: SyncResource[]
  }) => Promise<{ error?: string; tables: SyncTables }>
}

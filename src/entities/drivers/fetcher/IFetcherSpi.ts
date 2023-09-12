import { Record } from '@entities/drivers/database/Record'
import { SyncResource, SyncTables } from '@entities/drivers/database/Sync'

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

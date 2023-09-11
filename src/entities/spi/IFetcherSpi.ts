import { Record } from '@entities/orm/Record'
import { SyncResource, SyncTables } from '@entities/orm/Sync'

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

import { Record } from '@domain/entities/app/Record'
import { SyncResource, SyncTables } from '@domain/entities/app/Sync'

export interface FetcherGatewayAbstract {
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

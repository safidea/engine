import { RecordToPersite } from '@entities/services/database/record/Record'
import { IFetcherMapper } from '@entities/services/fetcher/IFetcherMapper'
import { SyncRecordsByTable, SyncResource } from '@entities/services/fetcher/sync/Sync'

export class FetcherService {
  constructor(private readonly mapper: IFetcherMapper) {}

  getSyncRecordsHook(resources: SyncResource[]) {
    return this.mapper.getSyncRecordsHook(resources)
  }

  getSyncRecordsFunction(): (options: {
    records?: RecordToPersite[]
    resources?: SyncResource[]
  }) => Promise<{ error?: string; tables: SyncRecordsByTable }> {
    return this.mapper.getSyncRecordsFunction()
  }
}

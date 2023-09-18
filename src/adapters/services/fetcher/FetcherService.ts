import { IFetcherDriver } from './IFetcherDriver'
import { RecordToPersite } from '@entities/services/database/record/Record'
import { useMemo } from 'react'
import { IFetcherService } from '@entities/services/fetcher/IFetcherService'
import { SyncRecordsByTable, SyncResource } from '@entities/services/fetcher/sync/Sync'
import { SyncMapper } from '@adapters/mappers/SyncMapper'
import { SyncRecordsByTableDto } from '@adapters/dtos/SyncDto'

export class FetcherService implements IFetcherService {
  constructor(private readonly driver: IFetcherDriver) {}

  getSyncRecordsHook(resources: SyncResource[]) {
    const useFetch = this.driver.getUseFetch()
    const syncDto = SyncMapper.toSyncDto({ resources })
    return () => {
      const options = useMemo(() => {
        return {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(syncDto),
        }
      }, [])
      const {
        data: { tables } = { tables: {} },
        error,
        isLoading,
      } = useFetch<{ tables: SyncRecordsByTableDto }>('/api/sync/table', options)
      return {
        tables: SyncMapper.toRecordsByTable(tables, resources),
        error,
        isLoading,
      }
    }
  }

  getSyncRecordsFunction(): (options: {
    records?: RecordToPersite[]
    resources?: SyncResource[]
  }) => Promise<{ error?: string; tables: SyncRecordsByTable }> {
    const fetch = this.driver.getFetch()
    return async ({ records = [], resources = [] }) => {
      const syncDto = SyncMapper.toSyncDto({ resources, records })
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(syncDto),
      }
      const res = await fetch('/api/sync/table', options).catch((e) => {
        return { json: () => Promise.resolve({ error: e.message }) }
      })
      const { error, tables } = await res.json()
      return {
        error,
        tables: SyncMapper.toRecordsByTable(tables, resources),
      }
    }
  }
}

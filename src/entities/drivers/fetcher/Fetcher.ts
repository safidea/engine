import { FetcherDriver } from './FetcherDriver'
import { Record } from '@entities/drivers/database/record/Record'
import { SyncResource, SyncTables } from '@entities/drivers/fetcher/sync/Sync'
import { useMemo } from 'react'

export class Fetcher {
  constructor(private readonly driver: FetcherDriver) {}

  getSyncRecordsHook(resources: SyncResource[]): () => {
    tables: SyncTables
    error?: string
    isLoading: boolean
  } {
    const useFetch = this.driver.getUseFetch()
    const resourcesDto = ResourceSyncMapper.toDtos(resources)
    return function useSyncRecords() {
      const options = useMemo(() => {
        return {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resources: resourcesDto }),
        }
      }, [])
      const {
        data: { tables } = { tables: {} },
        error,
        isLoading,
      } = useFetch<{ tables: TablesSyncDto }>('/api/sync/table', options)
      return {
        tables: TablesSyncMapper.toEntities(tables, app),
        error,
        isLoading,
      }
    }
  }

  getSyncRecordsFunction(): (options: {
    records?: Record[]
    resources?: SyncResource[]
  }) => Promise<{ error?: string; tables: SyncTables }> {
    const fetch = this.driver.getFetch()
    return async ({ records = [], resources = [] }) => {
      const commands = records
        .map((record) => {
          if (record.state === 'persisted') return undefined
          return {
            type: record.state,
            table: record.table.name,
            record: record.data(),
          }
        })
        .filter(Boolean)
      const resources = ResourceSyncMapper.toDtos(resources)
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commands, resources: resourcesDto }),
      }
      const res = await fetch('/api/sync/table', options).catch((e) => {
        return { json: () => Promise.resolve({ error: e.message }) }
      })
      const { error, tables } = await res.json()
      return {
        error,
        tables: TablesSyncMapper.toEntities(tables, app),
      }
    }
  }
}

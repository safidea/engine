import { IFetcherSpi } from '@domain/spi/IFetcherSpi'
import { IFetcherAdapter } from './IFetcherAdapter'
import { Record } from '@domain/entities/app/Record'
import { App } from '@domain/entities/app/App'
import { SyncResource, SyncTables } from '@domain/entities/app/Sync'
import { CommandSyncMapper } from '@adapter/api/app/mappers/sync/CommandSyncMapper'
import { ResourceSyncMapper } from '@adapter/api/app/mappers/sync/ResourceSyncMapper'
import { TablesSyncMapper } from '@adapter/api/app/mappers/sync/TablesSyncMapper'
import { TablesSyncDto } from '@adapter/api/app/dtos/sync/TablesSyncDto'
import { useMemo } from 'react'

export class FetcherSpi implements IFetcherSpi {
  constructor(
    private fetcherAdapter: IFetcherAdapter,
    private app: App
  ) {}

  getSyncRecordsHook(resources: SyncResource[]): () => {
    tables: SyncTables
    error?: string
    isLoading: boolean
  } {
    const useFetch = this.fetcherAdapter.getUseFetch()
    const app = this.app
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
    const fetch = this.fetcherAdapter.getFetch()
    const app = this.app
    return async ({ records = [], resources = [] }) => {
      const commandsDto = CommandSyncMapper.toDtos(records)
      const resourcesDto = ResourceSyncMapper.toDtos(resources)
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commands: commandsDto, resources: resourcesDto }),
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

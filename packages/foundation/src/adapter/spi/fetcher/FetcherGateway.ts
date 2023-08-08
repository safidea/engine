import { FetcherGatewayAbstract } from '@application/gateways/FetcherGatewayAbstract'
import { FetcherConnection } from './FetcherConnection'
import { Fetcher } from './Fetcher'
import { Record } from '@domain/entities/app/Record'
import { App } from '@domain/entities/app/App'
import { SyncResource, SyncTables } from '@domain/entities/app/Sync'
import { SyncCommandMapper } from '@adapter/api/app/mappers/sync/SyncCommandMapper'
import { SyncResourceMapper } from '@adapter/api/app/mappers/sync/SyncResourceMapper'
import { SyncTablesMapper } from '@adapter/api/app/mappers/sync/SyncTablesMapper'
import { SyncTablesDto } from '@adapter/api/app/dtos/sync/SyncTablesDto'
import { useMemo } from 'react'

export class FetcherGateway implements FetcherGatewayAbstract {
  private fetcherConnection: FetcherConnection

  constructor(
    fetcher: Fetcher,
    private app: App
  ) {
    this.fetcherConnection = new FetcherConnection(fetcher)
  }

  getSyncRecordsHook(resources: SyncResource[]): () => {
    tables: SyncTables
    error?: string
    isLoading: boolean
  } {
    const useFetch = this.fetcherConnection.getUseFetch()
    const app = this.app
    const resourcesDto = SyncResourceMapper.toDtos(resources)
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
      } = useFetch<{ tables: SyncTablesDto }>('/api/sync/table', options)

      return {
        tables: SyncTablesMapper.toEntities(tables, app),
        error,
        isLoading,
      }
    }
  }

  getSyncRecordsFunction(): (options: {
    records?: Record[]
    resources?: SyncResource[]
  }) => Promise<{ error?: string; tables: SyncTables }> {
    const fetch = this.fetcherConnection.getFetch()
    const app = this.app
    return async ({ records = [], resources = [] }) => {
      const commandsDto = SyncCommandMapper.toDtos(records)
      const resourcesDto = SyncResourceMapper.toDtos(resources)

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
        tables: SyncTablesMapper.toEntities(tables, app),
      }
    }
  }
}

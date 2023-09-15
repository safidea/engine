import { IFetcherDriver } from './IFetcherDriver'
import { Record } from '@entities/services/database/record/Record'
import { useMemo } from 'react'
import { PersistedRecord } from '@entities/services/database/record/state/persisted/PersistedRecord'
import {
  FetcherSync,
  FetcherSyncCommand,
  FetcherSyncResource,
  FetcherSyncResourceParams,
  FetcherSyncTablesRecords,
  FetcherSyncTablesRecordsData,
} from '@entities/services/fetcher/FetcherSync'
import { IFetcherService } from '@entities/services/fetcher/IFetcherService'

export class FetcherService implements IFetcherService {
  constructor(private readonly driver: IFetcherDriver) {}

  getSyncRecordsHook(resources: FetcherSyncResource[]) {
    const useFetch = this.driver.getUseFetch()
    const sync: FetcherSync = {
      resources: this.mapResourcesToParams(resources),
    }
    return () => {
      const options = useMemo(() => {
        return {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sync),
        }
      }, [])
      const {
        data: { tables } = { tables: {} },
        error,
        isLoading,
      } = useFetch<{ tables: FetcherSyncTablesRecordsData }>('/api/sync/table', options)
      return {
        tables: this.mapDataToRecords(tables, resources),
        error,
        isLoading,
      }
    }
  }

  getSyncRecordsFunction(): (options: {
    records: Record[]
    resources: FetcherSyncResource[]
  }) => Promise<{ error?: string; tables: FetcherSyncTablesRecords }> {
    const fetch = this.driver.getFetch()
    return async ({ records = [], resources = [] }) => {
      const sync: FetcherSync = {
        resources: this.mapResourcesToParams(resources),
        commands: this.mapRecordsToCommands(records),
      }
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sync),
      }
      const res = await fetch('/api/sync/table', options).catch((e) => {
        return { json: () => Promise.resolve({ error: e.message }) }
      })
      const { error, tables } = await res.json()
      return {
        error,
        tables: this.mapDataToRecords(tables, resources),
      }
    }
  }

  private mapDataToRecords(
    tablesRecordsData: FetcherSyncTablesRecordsData,
    resources: FetcherSyncResource[]
  ): FetcherSyncTablesRecords {
    return Object.entries(tablesRecordsData ?? {}).reduce(
      (acc: FetcherSyncTablesRecords, [tableName, records = []]) => {
        const table = resources.find((resource) => resource.table.name === tableName)?.table
        if (!table) return acc
        acc[tableName] = records.map((record) => new PersistedRecord(record, table))
        return acc
      },
      {}
    )
  }

  private mapResourcesToParams(resources: FetcherSyncResource[]): FetcherSyncResourceParams[] {
    return resources.map((resource) => {
      const { table, filters } = resource
      return {
        table: table.name,
        filters: filters?.map((filter) => filter.params),
      }
    })
  }

  private mapRecordsToCommands = (records: Record[]): FetcherSyncCommand[] => {
    const commands = []
    for (const record of records) {
      if (record.state !== 'persisted') {
        commands.push({
          action: record.state,
          table: record.table.name,
          record: record.data(),
        })
      }
    }
    return commands
  }
}

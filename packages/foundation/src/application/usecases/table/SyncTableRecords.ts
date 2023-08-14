import { IOrmSpi } from '@domain/spi/IOrmSpi'
import { Record } from '@domain/entities/app/Record'
import { SyncResource, SyncTables } from '@domain/entities/app/Sync'
import { ListTableRecords } from './ListTableRecords'
import { App } from '@domain/entities/app/App'

export interface TableToHandle {
  table: string
  records: Record[]
}

export class SyncTableRecords {
  private listTableRecord: ListTableRecords

  constructor(
    private ormSpi: IOrmSpi,
    app: App
  ) {
    this.listTableRecord = new ListTableRecords(ormSpi, app)
  }

  async execute(records: Record[] = [], resources: SyncResource[] = []): Promise<SyncTables> {
    if (records.length > 0) {
      const recordsToCreate: TableToHandle[] = []
      const recordsToUpdate: TableToHandle[] = []
      const recordsToSoftDelete: TableToHandle[] = []
      for (const record of records) {
        const state = record.getCurrentState()
        switch (state) {
          case 'create':
            const recordsToCreateTable = recordsToCreate.find((r) => r.table === record.tableName)
            if (recordsToCreateTable) {
              recordsToCreateTable.records.push(record)
            } else {
              recordsToCreate.push({
                table: record.tableName,
                records: [record],
              })
            }
            break
          case 'update':
            const recordsToUpdateTable = recordsToUpdate.find((r) => r.table === record.tableName)
            if (recordsToUpdateTable) {
              recordsToUpdateTable.records.push(record)
            } else {
              recordsToUpdate.push({
                table: record.tableName,
                records: [record],
              })
            }
            break
          case 'delete':
            const recordsToDeleteTable = recordsToSoftDelete.find(
              (r) => r.table === record.tableName
            )
            if (recordsToDeleteTable) {
              recordsToDeleteTable.records.push(record)
            } else {
              recordsToSoftDelete.push({
                table: record.tableName,
                records: [record],
              })
            }
            break
          default:
            throw new Error(`Record state "${state}" not supported`)
        }
      }
      for (const { table, records } of recordsToCreate) {
        await this.ormSpi.createMany(table, records)
      }
      for (const { table, records } of recordsToUpdate) {
        await this.ormSpi.updateMany(table, records)
      }
      for (const { table, records } of recordsToSoftDelete) {
        await this.ormSpi.updateMany(table, records)
      }
    }

    const tables: SyncTables = {}

    if (resources.length > 0) {
      const promises = []
      for (const { table, filters } of resources) {
        promises.push(
          this.listTableRecord
            .execute(table, filters ?? [])
            .then((records) => (tables[table] = records))
        )
      }
      await Promise.all(promises)
    }

    return tables
  }
}

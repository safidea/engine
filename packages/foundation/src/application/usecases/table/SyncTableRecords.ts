import { IOrmSpi } from '@domain/spi/IOrmSpi'
import { Record } from '@domain/entities/orm/Record'
import { SyncResource, SyncTables } from '@domain/entities/orm/Sync'
import { ListTableRecords } from './ListTableRecords'
import { App } from '@domain/entities/app/App'
import { StartedState } from '@adapter/spi/server/ServerSpi/StartedState'
import { CreateAutomationContextFromRecordId } from '../automation/CreateAutomationContextFromRecordId'

export interface TableToHandle {
  table: string
  records: Record[]
}

export class SyncTableRecords {
  private listTableRecord: ListTableRecords
  private createAutomationContextFromRecordId: CreateAutomationContextFromRecordId

  constructor(
    private ormSpi: IOrmSpi,
    app: App,
    private instance: StartedState
  ) {
    this.listTableRecord = new ListTableRecords(ormSpi, app)
    this.createAutomationContextFromRecordId = new CreateAutomationContextFromRecordId(ormSpi, app)
  }

  async execute(records: Record[] = [], resources: SyncResource[] = []): Promise<SyncTables> {
    if (records.length > 0) {
      const recordsToCreate: TableToHandle[] = []
      const recordsToUpdate: TableToHandle[] = []
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
          case 'delete':
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
      for (const { table, records } of recordsToCreate) {
        for (const record of records) {
          const context = await this.createAutomationContextFromRecordId.execute(table, record)
          await this.instance.emit('record_created', context)
        }
      }
      for (const { table, records } of recordsToUpdate) {
        for (const record of records) {
          const context = await this.createAutomationContextFromRecordId.execute(table, record)
          await this.instance.emit('record_updated', context)
        }
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

import { IOrmSpi } from '@entities/drivers/database/IOrmSpi'
import { Record } from '@entities/drivers/database/record'
import { SyncResource, SyncTables } from '@entities/drivers/database/sync/Sync'
import { ListTableRecords } from './ListTableRecords'
import { App } from '@entities/app/App'
import { StartedState } from '@entities/drivers/server/StartedState'
import { CreateAutomationContextFromRecordId } from '../automation/CreateAutomationContextFromRecordId'
import { IsAnyOfFilter } from '@entities/drivers/database/filter/isAnyOf/IsAnyOfFilter'
import { UpdateTableRecord } from './UpdateTableRecord'

export interface TableToHandle {
  table: string
  records: Record[]
}

export class SyncTableRecords {
  private listTableRecord: ListTableRecords
  private createAutomationContextFromRecord: CreateAutomationContextFromRecordId
  private updateTableRecord: UpdateTableRecord

  constructor(
    private ormSpi: IOrmSpi,
    app: App,
    private instance: StartedState
  ) {
    this.listTableRecord = new ListTableRecords(ormSpi, app)
    this.createAutomationContextFromRecord = new CreateAutomationContextFromRecordId(ormSpi, app)
    this.updateTableRecord = new UpdateTableRecord(ormSpi, app, instance)
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
      const persistedTablesRecords: TableToHandle[] = []
      for (const { table, records } of recordsToUpdate) {
        const persistedRecords = await this.listTableRecord.execute(table, [
          new IsAnyOfFilter(
            'id',
            records.map((r) => r.id)
          ),
        ])
        persistedTablesRecords.push({ table, records: persistedRecords })
        await this.ormSpi.updateMany(table, records)
      }
      for (const { table, records } of recordsToCreate) {
        for (const record of records) {
          const context = await this.createAutomationContextFromRecord.execute(table, record.id)
          await this.instance.emit('record_created', context)
        }
      }
      for (const { table, records } of recordsToUpdate) {
        for (const record of records) {
          if (record.getCurrentState() === 'update') {
            const persistedRecords = persistedTablesRecords.find((r) => r.table === table)?.records
            const persistedRecord = persistedRecords?.find((r) => r.id === record.id)
            if (!persistedRecord)
              throw new Error(`Persisted record not found for id "${record.id}"`)
            await this.updateTableRecord.emitEvent(table, record, persistedRecord)
          }
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

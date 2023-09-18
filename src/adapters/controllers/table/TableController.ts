import { RecordToPersite } from '@entities/services/database/record/Record'
import { Filter } from '@entities/services/database/filter/Filter'
import { Table } from '@entities/app/table/Table'
import { RecordToCreate } from '@entities/services/database/record/state/toCreate/RecordToCreate'
import { RecordToDelete } from '@entities/services/database/record/state/toDelete/RecordToDelete'
import { RecordToUpdate } from '@entities/services/database/record/state/toUpdate/RecordToUpdate'
import { Sync, SyncRecordsByTable } from '@entities/services/fetcher/sync/Sync'
import { App } from '@entities/app/App'
import { IDatabaseService } from '@entities/services/database/IDatabaseService'
import { PersistedRecord } from '@entities/services/database/record/state/persisted/PersistedRecord'

export class TableController {
  private readonly database: IDatabaseService

  constructor(app: App) {
    this.database = app.tables.services.database
  }

  async create(table: Table, record: RecordToCreate): Promise<string> {
    return this.database.create(table, record)
  }

  async createMany(table: Table, records: RecordToCreate[]): Promise<string[]> {
    return this.database.createMany(table, records)
  }

  async list(table: Table, filters: Filter[]): Promise<PersistedRecord[]> {
    return this.database.list(table, filters)
  }

  async update(table: Table, record: RecordToUpdate): Promise<void> {
    return this.database.softUpdate(table, record)
  }

  async delete(table: Table, record: RecordToDelete): Promise<void> {
    return this.database.softDelete(table, record)
  }

  async sync({ records, resources }: Sync): Promise<SyncRecordsByTable> {
    if (records) {
      const recordsToCreate: { table: Table; records: RecordToCreate[] }[] = []
      const recordsToUpdate: { table: Table; records: RecordToUpdate[] }[] = []
      const recordsToDelete: { table: Table; records: RecordToDelete[] }[] = []
      const addRecord = (
        record: RecordToPersite,
        lists: { table: Table; records: (RecordToCreate | RecordToUpdate | RecordToDelete)[] }[]
      ) => {
        const list = lists.find((r) => r.table.name === record.table.name)
        if (list) {
          list.records.push(record)
        } else {
          lists.push({
            table: record.table,
            records: [record],
          })
        }
      }
      for (const record of records) {
        if (record instanceof RecordToCreate) {
          addRecord(record, recordsToCreate)
        } else if (record instanceof RecordToUpdate) {
          addRecord(record, recordsToUpdate)
        } else if (record instanceof RecordToDelete) {
          addRecord(record, recordsToDelete)
        }
      }
      for (const { table, records } of recordsToCreate) {
        await this.database.createMany(table, records)
      }
      for (const { table, records } of recordsToUpdate) {
        await this.database.softUpdateMany(table, records)
      }
      for (const { table, records } of recordsToDelete) {
        await this.database.softDeleteMany(table, records)
      }
    }

    const tables: SyncRecordsByTable = {}
    const promises = []
    for (const { table, filters } of resources) {
      promises.push(
        this.database.list(table, filters ?? []).then((records) => (tables[table.name] = records))
      )
    }
    await Promise.all(promises)
    return tables
  }
}

import { RecordToPersite } from '@entities/services/database/record/Record'
import { Filter } from '@entities/services/database/filter/Filter'
import { DatabaseService } from '@adapters/services/database/DatabaseService'
import { Table } from '@entities/app/table/Table'
import { RecordToCreate } from '@entities/services/database/record/state/toCreate/RecordToCreate'
import { RecordToDelete } from '@entities/services/database/record/state/toDelete/RecordToDelete'
import { RecordToUpdate } from '@entities/services/database/record/state/toUpdate/RecordToUpdate'
import {
  FetcherSyncResource,
  FetcherSyncTablesRecordsData,
} from '@entities/services/fetcher/FetcherSync'

export class TableController {
  constructor(private database: DatabaseService) {}

  async create(table: Table, record: RecordToCreate) {
    return this.database.create(table, record)
  }

  async createMany(table: Table, records: RecordToCreate[]) {
    return this.database.createMany(table, records)
  }

  async read(table: Table, id: string) {
    return this.database.read(table, id)
  }

  async list(table: Table, filters: Filter[]) {
    return this.database.list(table, filters)
  }

  async update(table: Table, record: RecordToUpdate) {
    return this.database.softUpdate(table, record)
  }

  async delete(table: Table, record: RecordToDelete) {
    return this.database.softDelete(table, record)
  }

  async sync(records: RecordToPersite[], resources: FetcherSyncResource[]) {
    if (records.length > 0) {
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

    const tables: FetcherSyncTablesRecordsData = {}

    if (resources.length > 0) {
      const promises = []
      for (const { table, filters } of resources) {
        promises.push(
          this.database
            .list(table, filters ?? [])
            .then((records) => (tables[table.name] = records.map((record) => record.data())))
        )
      }
      await Promise.all(promises)
    }

    return tables
  }
}

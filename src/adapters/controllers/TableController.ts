import { Record } from '@entities/services/database/record/Record'
import { Filter } from '@entities/services/database/filter/Filter'
import { DatabaseService } from '@adapters/services/database/DatabaseService'
import { Table } from '@entities/app/table/Table'
import { RecordToCreate } from '@entities/services/database/record/state/toCreate/RecordToCreate'
import { RecordToDelete } from '@entities/services/database/record/state/toDelete/RecordToDelete'
import { RecordToUpdate } from '@entities/services/database/record/state/toUpdate/RecordToUpdate'

export class TableController {
  constructor(private database: DatabaseService) {}

  async sync(records: Record[], resources: SyncResource[]) {
    return this.getSyncRecordsFunction.execute(records, resources)
  }

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
}

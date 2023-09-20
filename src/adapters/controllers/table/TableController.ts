import { Filter } from '@entities/services/database/filter/Filter'
import { Table } from '@entities/app/table/Table'
import { RecordToCreate } from '@entities/services/database/record/state/toCreate/RecordToCreate'
import { RecordToDelete } from '@entities/services/database/record/state/toDelete/RecordToDelete'
import { RecordToUpdate } from '@entities/services/database/record/state/toUpdate/RecordToUpdate'
import { Sync, SyncRecordsByTable } from '@entities/services/fetcher/sync/Sync'
import { App } from '@entities/app/App'
import { PersistedRecord } from '@entities/services/database/record/state/persisted/PersistedRecord'
import { DatabaseService } from '@entities/services/database/DatabaseService'

export class TableController {
  private readonly database: DatabaseService

  constructor(app: App) {
    this.database = app.tables.database
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
    return this.database.sync({ records, resources })
  }
}

import { ReadTableRecord } from '@application/usecases/table/ReadTableRecord'
import { ListTableRecords } from '@application/usecases/table/ListTableRecords'
import { App } from '@domain/entities/app/App'
import { SoftDeleteTableRecord } from '@application/usecases/table/SoftDeleteTableRecord'
import { OrmSpi } from '@adapter/spi/orm/OrmSpi'
import { Record } from '@domain/entities/orm/Record'
import { Filter } from '@domain/entities/orm/Filter'
import { SyncTableRecords } from '@application/usecases/table/SyncTableRecords'
import { SyncResource } from '@domain/entities/orm/Sync'
import { CreateTableRecord } from '@application/usecases/table/CreateTableRecord'
import { StartedState } from '@adapter/spi/server/ServerSpi/StartedState'
import { UpdateTableRecord } from '@application/usecases/table/UpdateTableRecord'

export class TableController {
  private readTableRecord: ReadTableRecord
  private listTableRecords: ListTableRecords
  private softDeleteTableRecord: SoftDeleteTableRecord
  private getSyncRecordsFunction: SyncTableRecords
  private createTableRecord: CreateTableRecord
  private updateTableRecord: UpdateTableRecord

  constructor(
    app: App,
    private ormSpi: OrmSpi,
    instance: StartedState
  ) {
    this.createTableRecord = new CreateTableRecord(ormSpi, app, instance)
    this.readTableRecord = new ReadTableRecord(ormSpi, app)
    this.listTableRecords = new ListTableRecords(ormSpi, app)
    this.softDeleteTableRecord = new SoftDeleteTableRecord(ormSpi, app)
    this.getSyncRecordsFunction = new SyncTableRecords(ormSpi, app, instance)
    this.updateTableRecord = new UpdateTableRecord(ormSpi, app, instance)
  }

  async sync(records: Record[], resources: SyncResource[]) {
    return this.getSyncRecordsFunction.execute(records, resources)
  }

  async create(table: string, record: Record) {
    return this.createTableRecord.execute(table, record)
  }

  async createMany(table: string, records: Record[]) {
    return this.ormSpi.createMany(table, records)
  }

  async read(table: string, id: string) {
    return this.readTableRecord.execute(table, id)
  }

  async list(table: string, filters: Filter[]) {
    return this.listTableRecords.execute(table, filters)
  }

  async update(table: string, id: string, record: Record) {
    return this.updateTableRecord.execute(table, record, id)
  }

  async delete(table: string, id: string) {
    return this.softDeleteTableRecord.execute(table, id)
  }
}

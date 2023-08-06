import { ReadTableRecord } from '@application/usecases/table/ReadTableRecord'
import { ListTableRecords } from '@application/usecases/table/ListTableRecords'
import { App } from '@domain/entities/app/App'
import { SoftDeleteTableRecord } from '@application/usecases/table/SoftDeleteTableRecord'
import { OrmGateway } from '@adapter/spi/orm/OrmGateway'
import { Record } from '@domain/entities/app/Record'
import { Filter } from '@domain/entities/app/Filter'
import { SyncTableRecords } from '@application/usecases/table/SyncTableRecords'

export class TableController {
  private readTableRecord: ReadTableRecord
  private listTableRecords: ListTableRecords
  private softDeleteTableRecord: SoftDeleteTableRecord
  private syncTableRecords: SyncTableRecords

  constructor(
    app: App,
    private ormGateway: OrmGateway
  ) {
    this.readTableRecord = new ReadTableRecord(ormGateway, app)
    this.listTableRecords = new ListTableRecords(ormGateway, app)
    this.softDeleteTableRecord = new SoftDeleteTableRecord(ormGateway, app)
    this.syncTableRecords = new SyncTableRecords(ormGateway)
  }

  async sync(records: Record[]) {
    return this.syncTableRecords.execute(records)
  }

  async create(table: string, record: Record) {
    return this.ormGateway.create(table, record)
  }

  async createMany(table: string, records: Record[]) {
    return this.ormGateway.createMany(table, records)
  }

  async read(table: string, id: string) {
    return this.readTableRecord.execute(table, id)
  }

  async list(table: string, filters: Filter[]) {
    return this.listTableRecords.execute(table, filters)
  }

  async update(table: string, id: string, record: Record) {
    return this.ormGateway.update(table, record, id)
  }

  async delete(table: string, id: string) {
    return this.softDeleteTableRecord.execute(table, id)
  }
}

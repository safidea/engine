import { OrmGateway } from '@adapter/spi/gateways/OrmGateway'
import { CreateTableRecord } from '@application/usecases/table/CreateTableRecord'
import { ReadTableRecord } from '@application/usecases/table/ReadTableRecord'
import { ListTableRecords } from '@application/usecases/table/ListTableRecords'
import { CreateManyTableRecord } from '@application/usecases/table/CreateManyTableRecord'
import { UpdateTableRecord } from '@application/usecases/table/UpdateTableRecord'
import { App } from '@domain/entities/App'
import { IOrmGateway } from '@domain/gateways/IOrmGateway'
import { DeleteTableRecord } from '@application/usecases/table/DeleteTableRecord'
import { RecordDto } from '@application/dtos/table/RecordDto'
import { FilterDto } from '@application/dtos/table/FilterDto'
import { AppGateway } from '@adapter/spi/gateways/AppGateway'

export class TableController {
  private createTableRecord: CreateTableRecord
  private readTableRecord: ReadTableRecord
  private listTableRecords: ListTableRecords
  private createManyTableRecord: CreateManyTableRecord
  private updateTableRecord: UpdateTableRecord
  private deleteTableRecord: DeleteTableRecord

  constructor(app: App, orm: IOrmGateway) {
    const { tables } = app
    const ormGateway = new OrmGateway(orm, tables)
    const appGateway = new AppGateway(app)
    this.createTableRecord = new CreateTableRecord(ormGateway, appGateway)
    this.readTableRecord = new ReadTableRecord(ormGateway, appGateway)
    this.listTableRecords = new ListTableRecords(ormGateway, appGateway)
    this.createManyTableRecord = new CreateManyTableRecord(ormGateway, appGateway)
    this.updateTableRecord = new UpdateTableRecord(ormGateway, appGateway)
    this.deleteTableRecord = new DeleteTableRecord(ormGateway, appGateway)
  }

  async create(table: string, record: RecordDto) {
    return this.createTableRecord.execute(table, record)
  }

  async createMany(table: string, records: RecordDto[]) {
    return this.createManyTableRecord.execute(table, records)
  }

  async read(table: string, id: string) {
    return this.readTableRecord.execute(table, id)
  }

  async list(table: string, filters: FilterDto[]) {
    return this.listTableRecords.execute(table, filters)
  }

  async update(table: string, id: string, record: RecordDto) {
    return this.updateTableRecord.execute(table, record, id)
  }

  async delete(table: string, id: string) {
    return this.deleteTableRecord.execute(table, id)
  }
}

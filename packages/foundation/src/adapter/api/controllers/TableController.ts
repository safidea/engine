import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { CreateTableRecord } from '@application/usecases/CreateTableRecord'
import { ReadTableRecord } from '@application/usecases/ReadTableRecord'
import { ListTableRecords } from '@application/usecases/ListTableRecords'
import { CreateManyTableRecord } from '@application/usecases/CreateManyTableRecord'
import { UpdateTableRecord } from '@application/usecases/UpdateTableRecord'
import { App } from '@domain/entities/App'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'
import { ICodegenRepository } from '@domain/repositories/ICodegenRepository'
import { DeleteTableRecord } from '@application/usecases/DeleteTableRecord'
import { RecordDto } from '@application/dtos/RecordDto'
import { FilterDto } from '@application/dtos/FilterDto'

export class TableController {
  private createTableRecord: CreateTableRecord
  private readTableRecord: ReadTableRecord
  private listTableRecords: ListTableRecords
  private createManyTableRecord: CreateManyTableRecord
  private updateTableRecord: UpdateTableRecord
  private deleteTableRecord: DeleteTableRecord

  constructor(app: App, orm: IOrmRepository, codegen: ICodegenRepository) {
    const tableRepository = new TableRepository(app, orm, codegen)
    this.createTableRecord = new CreateTableRecord(tableRepository)
    this.readTableRecord = new ReadTableRecord(tableRepository)
    this.listTableRecords = new ListTableRecords(tableRepository)
    this.createManyTableRecord = new CreateManyTableRecord(tableRepository)
    this.updateTableRecord = new UpdateTableRecord(tableRepository)
    this.deleteTableRecord = new DeleteTableRecord(tableRepository)
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

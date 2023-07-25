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
import {
  LocalWithTableAndRecordDto,
  LocalWithTableAndArrayRecordDto,
  LocalWithTableAndIdDto,
  LocalWithTableAndFiltersDto,
  LocalWithTableAndRecordAndIdDto,
} from '@application/dtos/LocalDto'

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

  async create(local: LocalWithTableAndRecordDto) {
    const { table, record } = local
    return this.createTableRecord.execute(table, record)
  }

  async createMany(local: LocalWithTableAndArrayRecordDto) {
    const { table, records } = local
    return this.createManyTableRecord.execute(table, records)
  }

  async read(local: LocalWithTableAndIdDto) {
    const { table, id } = local
    return this.readTableRecord.execute(table, id)
  }

  async list(local: LocalWithTableAndFiltersDto) {
    const { table, filters } = local
    return this.listTableRecords.execute(table, filters)
  }

  async update(local: LocalWithTableAndRecordAndIdDto) {
    const { table, id, record } = local
    return this.updateTableRecord.execute(table, record, id)
  }

  async delete(local: LocalWithTableAndIdDto) {
    const { table, id } = local
    return this.deleteTableRecord.execute(table, id)
  }
}

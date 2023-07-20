import { RequestDto } from '@application/dtos/RequestDto'
import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { CreateTableRecord } from '@application/usecases/CreateTableRecord'
import { ReadTableRecord } from '@application/usecases/ReadTableRecord'
import { ListTableRecords } from '@application/usecases/ListTableRecords'
import { CreateManyTableRecord } from '@application/usecases/CreateManyTableRecord'
import { App } from '@domain/entities/App'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'
import { ICodegenRepository } from '@domain/repositories/ICodegenRepository'

export class TableController {
  private createTableRecord: CreateTableRecord
  private readTableRecord: ReadTableRecord
  private listTableRecords: ListTableRecords
  private createManyTableRecord: CreateManyTableRecord

  constructor(app: App, orm: IOrmRepository, codegen: ICodegenRepository) {
    const tableRepository = new TableRepository(app, orm, codegen)
    this.createTableRecord = new CreateTableRecord(tableRepository)
    this.readTableRecord = new ReadTableRecord(tableRepository)
    this.listTableRecords = new ListTableRecords(tableRepository)
    this.createManyTableRecord = new CreateManyTableRecord(tableRepository)
  }

  async create(request: RequestDto) {
    const { table } = request.params ?? {}
    if (!request.body) throw new Error('Body is required')
    if (Array.isArray(request.body)) return this.createManyTableRecord.execute(table, request.body)
    return this.createTableRecord.execute(table, request.body)
  }

  async read(request: RequestDto) {
    const { table, id } = request.params ?? {}
    return this.readTableRecord.execute(table, id)
  }

  async list(request: RequestDto) {
    const { table } = request.params ?? {}
    return this.listTableRecords.execute(table)
  }
}

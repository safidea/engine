import { RequestWithLocalDto } from '@application/dtos/RequestDto'
import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { CreateTableRecord } from '@application/usecases/CreateTableRecord'
import { ReadTableRecord } from '@application/usecases/ReadTableRecord'
import { ListTableRecords } from '@application/usecases/ListTableRecords'
import { CreateManyTableRecord } from '@application/usecases/CreateManyTableRecord'
import { UpdateTableRecord } from '@application/usecases/UpdateTableRecord'
import { App } from '@domain/entities/App'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'
import { ICodegenRepository } from '@domain/repositories/ICodegenRepository'

export class TableController {
  private createTableRecord: CreateTableRecord
  private readTableRecord: ReadTableRecord
  private listTableRecords: ListTableRecords
  private createManyTableRecord: CreateManyTableRecord
  private updateTableRecord: UpdateTableRecord

  constructor(app: App, orm: IOrmRepository, codegen: ICodegenRepository) {
    const tableRepository = new TableRepository(app, orm, codegen)
    this.createTableRecord = new CreateTableRecord(tableRepository)
    this.readTableRecord = new ReadTableRecord(tableRepository)
    this.listTableRecords = new ListTableRecords(tableRepository)
    this.createManyTableRecord = new CreateManyTableRecord(tableRepository)
    this.updateTableRecord = new UpdateTableRecord(tableRepository)
  }

  async create(request: RequestWithLocalDto) {
    const { table } = request.params ?? {}
    if (!request.body) throw new Error('Body is required')
    if (Array.isArray(request.body)) return this.createManyTableRecord.execute(table, request.body)
    return this.createTableRecord.execute(table, request.body)
  }

  async read(request: RequestWithLocalDto) {
    const { table, id } = request.params ?? {}
    return this.readTableRecord.execute(table, id)
  }

  async list(request: RequestWithLocalDto) {
    const { table } = request.params ?? {}
    const { filters } = request.local
    return this.listTableRecords.execute(table, filters)
  }

  async update(request: RequestWithLocalDto) {
    const { table, id } = request.params ?? {}
    if (!request.body) throw new Error('Body is required')
    return this.updateTableRecord.execute(table, request.body, id)
  }
}

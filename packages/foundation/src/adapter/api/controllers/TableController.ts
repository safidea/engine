import { RequestDto } from '@application/dtos/RequestDto'
import { AppController } from './AppController'
import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { CreateTableRecord } from '@application/usecases/CreateTableRecord'
import { ReadTableRecord } from '@application/usecases/ReadTableRecord'
import { ListTableRecords } from '@application/usecases/ListTableRecords'

export class TableController {
  private createTableRecord: CreateTableRecord
  private readTableRecord: ReadTableRecord
  private listTableRecords: ListTableRecords

  constructor(appController: AppController) {
    const tableRepository = new TableRepository(appController)
    this.createTableRecord = new CreateTableRecord(tableRepository)
    this.readTableRecord = new ReadTableRecord(tableRepository)
    this.listTableRecords = new ListTableRecords(tableRepository)
  }

  async create(request: RequestDto) {
    const { table } = request.params ?? {}
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

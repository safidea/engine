import { RecordToCreateDto } from '@application/dtos/RecordDto'
import { generateRecord, generateManyRecords } from './helpers'
import { CreateTableRecord } from '@application/usecases/CreateTableRecord'
import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { ListTableRecords } from '@application/usecases/ListTableRecords'
import { CreateManyTableRecord } from '@application/usecases/CreateManyTableRecord'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'
import { ICodegenRepository } from '@domain/repositories/ICodegenRepository'
import { App } from '@domain/entities/App'

export class FixtureDatabase {
  private createTableRecord: CreateTableRecord
  private listTableRecords: ListTableRecords
  private createManyTableRecords: CreateManyTableRecord

  constructor(app: App, orm: IOrmRepository, codegen: ICodegenRepository) {
    const tableRepository = new TableRepository(app, orm, codegen)
    this.createTableRecord = new CreateTableRecord(tableRepository)
    this.listTableRecords = new ListTableRecords(tableRepository)
    this.createManyTableRecords = new CreateManyTableRecord(tableRepository)
  }

  list(table: string) {
    return this.listTableRecords.execute(table)
  }

  createRecord(table: string, recordToCreateDto?: RecordToCreateDto) {
    const record = generateRecord(table, recordToCreateDto)
    return this.createTableRecord.execute(table, record)
  }

  createManyRecords(table: string, countOrRecordsToCreateDto: number | RecordToCreateDto[] = 1) {
    const records = generateManyRecords(table, countOrRecordsToCreateDto)
    return this.createManyTableRecords.execute(table, records)
  }
}

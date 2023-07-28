import { RecordToCreateDto } from '@application/dtos/table/RecordDto'
import { generateRecord, generateManyRecords } from './helpers'
import { CreateTableRecord } from '@application/usecases/table/CreateTableRecord'
import { TableGateway } from '@adapter/spi/gateways/TableGateway'
import { ListTableRecords } from '@application/usecases/table/ListTableRecords'
import { CreateManyTableRecord } from '@application/usecases/table/CreateManyTableRecord'
import { IOrmGateway } from '@domain/gateways/IOrmGateway'
import { ICodegenGateway } from '@domain/gateways/ICodegenGateway'
import { App } from '@domain/entities/App'

export class FixtureDatabase {
  private createTableRecord: CreateTableRecord
  private listTableRecords: ListTableRecords
  private createManyTableRecords: CreateManyTableRecord

  constructor(app: App, orm: IOrmGateway, codegen: ICodegenGateway) {
    const tableGateway = new TableGateway(app, orm, codegen)
    this.createTableRecord = new CreateTableRecord(tableGateway)
    this.listTableRecords = new ListTableRecords(tableGateway)
    this.createManyTableRecords = new CreateManyTableRecord(tableGateway)
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

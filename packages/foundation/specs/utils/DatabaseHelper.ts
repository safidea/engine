import { RecordToCreateDto } from '@application/dtos/table/RecordDto'
import { generateRecord, generateManyRecords } from './helpers'
import { CreateTableRecord } from '@application/usecases/table/CreateTableRecord'
import { OrmGateway } from '@adapter/spi/gateways/OrmGateway'
import { ListTableRecords } from '@application/usecases/table/ListTableRecords'
import { CreateManyTableRecord } from '@application/usecases/table/CreateManyTableRecord'
import { IOrmGateway } from '@domain/gateways/IOrmGateway'
import { App } from '@domain/entities/App'
import { AppGateway } from '@adapter/spi/gateways/AppGateway'

export class DatabaseHelper {
  private createTableRecord: CreateTableRecord
  private listTableRecords: ListTableRecords
  private createManyTableRecords: CreateManyTableRecord

  constructor(app: App, orm: IOrmGateway) {
    const { tables } = app
    const ormGateway = new OrmGateway(orm, tables)
    const appGateway = new AppGateway(app)
    this.createTableRecord = new CreateTableRecord(ormGateway, appGateway)
    this.listTableRecords = new ListTableRecords(ormGateway, appGateway)
    this.createManyTableRecords = new CreateManyTableRecord(ormGateway, appGateway)
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

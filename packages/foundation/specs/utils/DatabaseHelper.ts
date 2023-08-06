import { RecordToCreateDto } from '@application/dtos/table/RecordDto'
import { generateRecord, generateManyRecords } from './helpers'
import { CreateTableRecord } from '@application/usecases/table/CreateTableRecord'
import { OrmConnection } from '@adapter/spi/orm/OrmConnection'
import { ListTableRecords } from '@application/usecases/table/ListTableRecords'
import { CreateManyTableRecord } from '@application/usecases/table/CreateManyTableRecord'
import { Orm } from '@adapter/spi/orm/Orm'
import { App } from '@domain/entities/app/App'

export class DatabaseHelper {
  private createTableRecord: CreateTableRecord
  private listTableRecords: ListTableRecords
  private createManyTableRecords: CreateManyTableRecord

  constructor(app: App, orm: Orm) {
    const { tables } = app
    const ormConnection = new OrmConnection(orm, tables)
    this.createTableRecord = new CreateTableRecord(ormConnection, app)
    this.listTableRecords = new ListTableRecords(ormConnection, app)
    this.createManyTableRecords = new CreateManyTableRecord(ormConnection, app)
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

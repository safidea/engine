import { generateRecord, generateManyRecords } from './helpers'
import { ListTableRecords } from '@application/usecases/table/ListTableRecords'
import { Orm } from '@adapter/spi/orm/Orm'
import { App } from '@domain/entities/app/App'
import { OrmGateway } from '@adapter/spi/orm/OrmGateway'
import { RecordDto } from '@adapter/api/app/dtos/RecordDto'

export class DatabaseHelper {
  private ormGateway: OrmGateway
  private listTableRecords: ListTableRecords

  constructor(app: App, orm: Orm) {
    this.ormGateway = new OrmGateway(orm, app)
    this.listTableRecords = new ListTableRecords(this.ormGateway, app)
  }

  list(table: string) {
    return this.listTableRecords.execute(table)
  }

  createRecord(table: string, recordDto?: RecordDto) {
    const record = generateRecord(table, recordToCreateDto)
    return this.ormGateway.create(table, record)
  }

  createManyRecords(table: string, countOrRecordsToCreateDto: number | RecordToCreateDto[] = 1) {
    const records = generateManyRecords(table, countOrRecordsToCreateDto)
    return this.ormGateway.createMany(table, records)
  }
}

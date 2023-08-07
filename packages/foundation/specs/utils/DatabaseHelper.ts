import { ListTableRecords } from '@application/usecases/table/ListTableRecords'
import { Orm } from '@adapter/spi/orm/Orm'
import { App } from '@domain/entities/app/App'
import { OrmGateway } from '@adapter/spi/orm/OrmGateway'
import { ExtendRecordDto, RecordsByTables, generateRecords } from './helpers'
import { Record } from '@domain/entities/app/Record'

export class DatabaseHelper {
  private ormGateway: OrmGateway
  private listTableRecords: ListTableRecords

  constructor(app: App, orm: Orm) {
    this.ormGateway = new OrmGateway(orm, app)
    this.listTableRecords = new ListTableRecords(this.ormGateway, app)
  }

  async list(table: string): Promise<Record[]> {
    return this.listTableRecords.execute(table)
  }

  async createRecords(
    table: string,
    countOrRecordsDto?: number | ExtendRecordDto[]
  ): Promise<RecordsByTables> {
    const tables = generateRecords(table, countOrRecordsDto)
    for (const [table, records] of Object.entries(tables)) {
      await this.ormGateway.createMany(table, records)
    }
    return tables
  }
}

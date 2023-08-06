import { ReadTableRecord } from './ReadTableRecord'
import { App } from '@domain/entities/app/App'
import { OrmGatewayAbstract } from '@application/gateways/OrmGatewayAbstract'
import { Record } from '@domain/entities/app/Record'
import { Filter } from '@domain/entities/app/Filter'

export class ListTableRecords {
  private readTableRecord: ReadTableRecord

  constructor(
    private ormGateway: OrmGatewayAbstract,
    app: App
  ) {
    this.readTableRecord = new ReadTableRecord(ormGateway, app)
  }

  async execute(table: string, filters: Filter[] = []): Promise<Record[]> {
    const records = await this.ormGateway.list(table, filters)
    const promises = []
    for (const record of records) {
      promises.push(this.readTableRecord.runRecordFormulas(record, table))
    }
    return Promise.all(promises)
  }
}

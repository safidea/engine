import { ReadTableRecord } from './ReadTableRecord'
import { App } from '@domain/entities/app/App'
import { IOrmSpi } from '@domain/spi/IOrmSpi'
import { Record } from '@domain/entities/app/Record'
import { Filter } from '@domain/entities/app/Filter'

export class ListTableRecords {
  private readTableRecord: ReadTableRecord

  constructor(
    private ormSpi: IOrmSpi,
    app: App
  ) {
    this.readTableRecord = new ReadTableRecord(ormSpi, app)
  }

  async execute(table: string, filters: Filter[] = []): Promise<Record[]> {
    const records = await this.ormSpi.list(table, filters)
    const promises = []
    for (const record of records) {
      promises.push(this.readTableRecord.runRecordFormulas(record, table))
    }
    return Promise.all(promises)
  }
}

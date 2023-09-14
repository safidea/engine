import { ReadTableRecord } from './ReadTableRecord'
import { App } from '@entities/app/App'
import { IOrmSpi } from '@entities/drivers/database/IOrmSpi'
import { Record } from '@entities/drivers/database/record'
import { Filter } from '@entities/drivers/database/filter/Filter'

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

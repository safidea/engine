import { App } from '@domain/entities/app/App'
import { IOrmSpi } from '@domain/spi/IOrmSpi'
import { Record } from '@domain/entities/orm/Record'

export class SoftDeleteManyTableRecords {
  constructor(
    private ormSpi: IOrmSpi,
    private app: App
  ) {}

  async execute(tableName: string, ids: string[]): Promise<void> {
    const table = this.app.getTableByName(tableName)
    const records = ids.map((id) => new Record({ id }, table, 'delete'))
    await this.ormSpi.updateMany(tableName, records)
  }
}

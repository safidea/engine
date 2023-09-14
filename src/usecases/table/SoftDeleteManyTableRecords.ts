import { App } from '@entities/app/App'
import { IOrmSpi } from '@entities/drivers/database/IOrmSpi'
import { Record } from '@entities/drivers/database/record'

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

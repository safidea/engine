import { IOrmSpi } from '@entities/spi/IOrmSpi'
import { App } from '@entities/app/App'
import { Record } from '@entities/orm/Record'

export class SoftDeleteTableRecord {
  constructor(
    private ormSpi: IOrmSpi,
    private app: App
  ) {}

  async execute(tableName: string, id: string): Promise<void> {
    const record = new Record({ id }, this.app.getTableByName(tableName), 'delete')
    await this.ormSpi.update(tableName, record, id)
  }
}

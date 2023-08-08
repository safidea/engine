import { App } from '@domain/entities/app/App'
import { OrmGatewayAbstract } from '@application/gateways/OrmGatewayAbstract'
import { Record } from '@domain/entities/app/Record'

export class SoftDeleteManyTableRecords {
  constructor(
    private ormGateway: OrmGatewayAbstract,
    private app: App
  ) {}

  async execute(tableName: string, ids: string[]): Promise<void> {
    const table = this.app.getTableByName(tableName)
    const records = ids.map((id) => new Record({ id }, table, 'delete'))
    await this.ormGateway.updateMany(tableName, records)
  }
}

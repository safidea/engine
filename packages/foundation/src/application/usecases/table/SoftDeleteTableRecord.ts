import { OrmGatewayAbstract } from '@application/gateways/OrmGatewayAbstract'
import { App } from '@domain/entities/app/App'
import { Record } from '@domain/entities/app/Record'

export class SoftDeleteTableRecord {
  constructor(
    private ormGateway: OrmGatewayAbstract,
    private app: App
  ) {}

  async execute(tableName: string, id: string): Promise<void> {
    const record = new Record({ id }, this.app.tables, tableName, 'delete')
    await this.ormGateway.update(tableName, record, id)
  }
}

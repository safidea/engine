import { IOrmSpi } from '@domain/spi/IOrmSpi'
import { Record } from '@domain/entities/orm/Record'
import { StartedState } from '@adapter/spi/server/ServerSpi/StartedState'
import { CreateAutomationContextFromRecord } from '../automation/CreateAutomationContextFromRecord'
import { App } from '@domain/entities/app/App'

export class CreateTableRecord {
  private createAutomationContextFromRecord: CreateAutomationContextFromRecord

  constructor(
    private ormSpi: IOrmSpi,
    app: App,
    private instance: StartedState
  ) {
    this.createAutomationContextFromRecord = new CreateAutomationContextFromRecord(ormSpi, app)
  }

  async execute(table: string, record: Record): Promise<string> {
    const id = await this.ormSpi.create(table, record)
    const context = await this.createAutomationContextFromRecord.execute(table, record)
    await this.instance.emit('record_created', context)
    return id
  }
}

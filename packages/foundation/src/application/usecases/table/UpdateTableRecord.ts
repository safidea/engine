import { IOrmSpi } from '@domain/spi/IOrmSpi'
import { Record } from '@domain/entities/orm/Record'
import { StartedState } from '@adapter/spi/server/ServerSpi/StartedState'
import { App } from '@domain/entities/app/App'
import { CreateAutomationContextFromRecord } from '../automation/CreateAutomationContextFromRecord'

export class UpdateTableRecord {
  private createAutomationContextFromRecord: CreateAutomationContextFromRecord

  constructor(
    private ormSpi: IOrmSpi,
    app: App,
    private instance: StartedState
  ) {
    this.createAutomationContextFromRecord = new CreateAutomationContextFromRecord(ormSpi, app)
  }

  async execute(table: string, record: Record, id: string): Promise<string> {
    await this.ormSpi.update(table, record, id)
    const context = await this.createAutomationContextFromRecord.execute(table, record)
    await this.instance.emit('record_updated', context)
    return id
  }
}

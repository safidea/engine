import { IOrmSpi } from '@domain/spi/IOrmSpi'
import { Record } from '@domain/entities/orm/Record'
import { StartedState } from '@adapter/spi/server/ServerSpi/StartedState'
import { App } from '@domain/entities/app/App'
import { CreateAutomationContextFromRecordId } from '../automation/CreateAutomationContextFromRecordId'

export class UpdateTableRecord {
  private createAutomationContextFromRecordId: CreateAutomationContextFromRecordId

  constructor(
    private ormSpi: IOrmSpi,
    app: App,
    private instance: StartedState
  ) {
    this.createAutomationContextFromRecordId = new CreateAutomationContextFromRecordId(ormSpi, app)
  }

  async execute(table: string, record: Record, id: string): Promise<string> {
    await this.ormSpi.update(table, record, id)
    const context = await this.createAutomationContextFromRecordId.execute(table, record)
    await this.instance.emit('record_updated', context)
    return id
  }
}

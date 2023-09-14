import { IOrmSpi } from '@entities/drivers/database/IOrmSpi'
import { Record } from '@entities/drivers/database/record'
import { StartedState } from '@entities/drivers/server/StartedState'
import { CreateAutomationContextFromRecordId } from '../automation/CreateAutomationContextFromRecordId'
import { App } from '@entities/app/App'

export class CreateTableRecord {
  private createAutomationContextFromRecord: CreateAutomationContextFromRecordId

  constructor(
    private ormSpi: IOrmSpi,
    app: App,
    private instance: StartedState
  ) {
    this.createAutomationContextFromRecord = new CreateAutomationContextFromRecordId(ormSpi, app)
  }

  async execute(table: string, record: Record): Promise<string> {
    const id = await this.ormSpi.create(table, record)
    const context = await this.createAutomationContextFromRecord.execute(table, record.id)
    await this.instance.emit('record_created', context)
    return id
  }
}

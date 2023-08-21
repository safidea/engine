import { IOrmSpi } from '@domain/spi/IOrmSpi'
import { Record } from '@domain/entities/orm/Record'
import { StartedState } from '@adapter/spi/server/ServerSpi/StartedState'
import { App } from '@domain/entities/app/App'
import { ReadTableRecord } from './ReadTableRecord'
import { CreateAutomationContextFromRecordId } from '../automation/CreateAutomationContextFromRecordId'

export class CreateTableRecord {
  private readTableRecord: ReadTableRecord
  private createAutomationContextFromRecordId: CreateAutomationContextFromRecordId

  constructor(
    private ormSpi: IOrmSpi,
    private app: App,
    private instance: StartedState
  ) {
    this.readTableRecord = new ReadTableRecord(ormSpi, app)
    this.createAutomationContextFromRecordId = new CreateAutomationContextFromRecordId(ormSpi, app)
  }

  async execute(table: string, recordToCreate: Record): Promise<string> {
    const id = await this.ormSpi.create(table, recordToCreate)
    const record = await this.readTableRecord.execute(table, id)
    const context = await this.createAutomationContextFromRecordId.execute(table, record.id)
    await this.instance.emit('record_created', context)
    return id
  }
}

import { IOrmSpi } from '@domain/spi/IOrmSpi'
import { Record } from '@domain/entities/orm/Record'
import { StartedState } from '@adapter/spi/server/ServerSpi/StartedState'
import { App } from '@domain/entities/app/App'
import { ReadTableRecord } from './ReadTableRecord'
import { MultipleLinkedRecords } from '@domain/entities/table/fields/MultipleLinkedRecords'
import { ListTableRecords } from './ListTableRecords'
import { IsAnyOf } from '@domain/entities/orm/filters/IsAnyOf'
import { AutomationContext } from '@domain/entities/automation/Automation'

export class CreateTableRecord {
  private readTableRecord: ReadTableRecord

  constructor(
    private ormSpi: IOrmSpi,
    private app: App,
    private instance: StartedState
  ) {
    this.readTableRecord = new ReadTableRecord(ormSpi, app)
  }

  async execute(table: string, recordToCreate: Record): Promise<string> {
    const id = await this.ormSpi.create(table, recordToCreate)
    const record = await this.readTableRecord.execute(table, id)
    const data: AutomationContext = { ...record.toDto() }
    for (const field of this.app.getTableFields(table)) {
      if (field instanceof MultipleLinkedRecords) {
        const listTableRecords = new ListTableRecords(this.ormSpi, this.app)
        const ids = record.getMultipleLinkedRecordsValue(field.name)
        const linkedRecords = await listTableRecords.execute(field.table, [new IsAnyOf('id', ids)])
        data[field.name] = linkedRecords.map((record) => record.toDto())
      }
    }
    await this.instance.emit('record_created', { table, data })
    return id
  }
}

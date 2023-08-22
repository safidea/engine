import { MultipleLinkedRecordsField } from '@domain/entities/table/fields/MultipleLinkedRecordsField'
import { App } from '@domain/entities/app/App'
import { IOrmSpi } from '@domain/spi/IOrmSpi'
import { IsAnyOf } from '@domain/entities/orm/filters/IsAnyOf'
import { ListTableRecords } from '../table/ListTableRecords'
import { AutomationContext } from '@domain/entities/automation/Automation'
import { ReadTableRecord } from '../table/ReadTableRecord'

export class CreateAutomationContextFromRecordId {
  private readTableRecord: ReadTableRecord

  constructor(
    private ormSpi: IOrmSpi,
    private app: App
  ) {
    this.readTableRecord = new ReadTableRecord(ormSpi, app)
  }

  async execute(table: string, id: string): Promise<AutomationContext> {
    const record = await this.readTableRecord.execute(table, id)
    const data: AutomationContext = { ...record.toDto() }
    for (const field of this.app.getTableFields(table)) {
      if (field instanceof MultipleLinkedRecordsField) {
        const listTableRecords = new ListTableRecords(this.ormSpi, this.app)
        const ids = record.getMultipleLinkedRecordsValue(field.name)
        const linkedRecords = await listTableRecords.execute(field.table, [new IsAnyOf('id', ids)])
        data[field.name] = linkedRecords.map((record) => record.toDto())
      }
    }
    return { table, data }
  }
}

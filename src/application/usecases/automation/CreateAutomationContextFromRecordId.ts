import { MultipleLinkedRecordsField } from '@domain/entities/table/fields/MultipleLinkedRecordsField'
import { App } from '@domain/entities/app/App'
import { IOrmSpi } from '@domain/spi/IOrmSpi'
import { IsAnyOfFilter } from '@domain/entities/orm/filters/IsAnyOfFilter'
import { ListTableRecords } from '../table/ListTableRecords'
import { AutomationContext } from '@domain/entities/automation/Automation'
import { ReadTableRecord } from '../table/ReadTableRecord'

// TODO: Déplacer ce usecase dans l'entité BaseAction

export class CreateAutomationContextFromRecordId {
  private readTableRecord: ReadTableRecord

  constructor(
    private ormSpi: IOrmSpi,
    private app: App
  ) {
    this.readTableRecord = new ReadTableRecord(ormSpi, app)
  }

  async execute(table: string, id: string): Promise<AutomationContext> {
    const context: AutomationContext = { table }
    const record = await this.readTableRecord.execute(table, id)
    context.data = { ...record.toDto() }
    for (const field of this.app.getTableFields(table)) {
      if (field instanceof MultipleLinkedRecordsField) {
        const listTableRecords = new ListTableRecords(this.ormSpi, this.app)
        const ids = record.getMultipleLinkedRecordsValue(field.name)
        const linkedRecords = await listTableRecords.execute(field.table, [
          new IsAnyOfFilter('id', ids),
        ])
        context.data[field.name] = linkedRecords.map((record) => record.toDto())
      }
    }
    return context
  }
}

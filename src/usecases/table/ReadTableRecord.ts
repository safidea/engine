import { ListTableRecords } from './ListTableRecords'
import { RollupField } from '@entities/app/table/fields/RollupField'
import { FormulaField } from '@entities/app/table/fields/FormulaField'
import { MultipleLinkedRecordsField } from '@entities/app/table/fields/MultipleLinkedRecordsField'
import { App } from '@entities/app/App'
import { IOrmSpi } from '@entities/spi/IOrmSpi'
import { Record } from '@entities/orm/Record'
import { IsAnyOfFilter } from '@entities/orm/filters/IsAnyOfFilter'
import { Script } from '@entities/app/Script'

export class ReadTableRecord {
  constructor(
    private ormSpi: IOrmSpi,
    private app: App
  ) {}

  async execute(table: string, id: string): Promise<Record> {
    const record = await this.ormSpi.read(table, id)
    if (!record) throw new Error(`Record "${id}" not found in table "${table}"`)
    return this.runRecordFormulas(record, table)
  }

  async runRecordFormulas(record: Record, table: string) {
    const fields = this.app.getTableFields(table)
    if (fields.length > 0) {
      for (const field of fields)
        if (field instanceof RollupField) await this.runFieldRollupFormula(record, field, table)
      for (const field of fields)
        if (field instanceof FormulaField) await this.runFieldFormula(record, field)
    }
    return record
  }

  async runFieldRollupFormula(record: Record, fieldRollup: RollupField, table: string) {
    const { formula } = fieldRollup
    const fields = this.app.getTableFields(table)
    const field = fields.find((f) => f.name === fieldRollup.linkedRecords)
    if (!field || !(field instanceof MultipleLinkedRecordsField))
      throw new Error(`Field "${fieldRollup.linkedRecords}" not found in runFieldRollupFormula`)
    const listTableRecords = new ListTableRecords(this.ormSpi, this.app)
    const values = record.getFieldValue(field.name)
    if (!Array.isArray(values)) throw new Error('Values are not an array')
    const linkedRecords = await listTableRecords.execute(field.table, [
      new IsAnyOfFilter('id', values),
    ])
    const context = {
      values: linkedRecords.map((record) => String(record.getFieldValue(fieldRollup.linkedField))),
    }
    const result = new Script(formula, context).run()
    record.setCalculatedFieldValue(fieldRollup.name, result)
  }

  async runFieldFormula(record: Record, fieldFormula: FormulaField) {
    const { formula } = fieldFormula
    const context = record.fields
    const result = new Script(formula, context).run()
    record.setCalculatedFieldValue(fieldFormula.name, result)
  }
}

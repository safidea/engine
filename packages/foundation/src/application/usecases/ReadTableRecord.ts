import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { ListTableRecords } from './ListTableRecords'
import { Rollup } from '@domain/entities/fields/Rollup'
import { Formula } from '@domain/entities/fields/Formula'
import { Record } from '@domain/entities/Record'
import { MultipleLinkedRecords } from '@domain/entities/fields/MultipleLinkedRecords'

export class ReadTableRecord {
  constructor(private tableRepository: TableRepository) {}

  async execute(table: string, id: string): Promise<Record> {
    const record = await this.tableRepository.read(table, id)
    return this.enrichRecord(record, table)
  }

  async enrichRecord(record: Record, table: string) {
    const fields = await this.tableRepository.getTableFields(table)
    if (fields.length > 0) {
      for (const field of fields)
        if (field instanceof Rollup) await this.runFieldRollupFormula(record, field, table)
      for (const field of fields)
        if (field instanceof Formula) await this.runFieldFormula(record, field)
    }
    return record
  }

  async runFieldRollupFormula(record: Record, fieldRollup: Rollup, table: string) {
    const { formula } = fieldRollup
    const fields = await this.tableRepository.getTableFields(table)
    const field = fields.find((f) => f.name === fieldRollup.linkedRecords)
    if (!field || !(field instanceof MultipleLinkedRecords)) throw new Error('Field not found')
    const listTableRepository = new ListTableRecords(this.tableRepository)
    const values = record.fields[field.name]
    if (!Array.isArray(values)) throw new Error('Values are not an array')
    const linkedRecords = await listTableRepository.execute(field.table, [
      { field: 'id', operator: 'is_any_of', value: values },
    ])
    const context = {
      values: linkedRecords.map((record) => String(record.fields[fieldRollup.linkedField])),
    }
    const result = await this.tableRepository.runFormula(formula, context, this.getFunctions())
    if (result) record.fields[fieldRollup.name] = result
  }

  async runFieldFormula(record: Record, fieldFormula: Formula) {
    const { formula } = fieldFormula
    const context = record.fields
    const result = await this.tableRepository.runFormula(formula, context, this.getFunctions())
    if (result) record.fields[fieldFormula.name] = result
  }

  getFunctions(): { [key: string]: string } {
    return {
      sum: String((array: (number | string)[]) => array.reduce((a, b) => Number(a) + Number(b), 0)),
    }
  }
}

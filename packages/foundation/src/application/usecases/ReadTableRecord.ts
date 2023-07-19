import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { FieldFormulaDto } from '@application/dtos/FieldFormulaDto'
import { FieldRollupDto } from '@application/dtos/FieldRollupDto'
import { RecordDto } from '@application/dtos/RecordDto'
import { ListTableRecords } from './ListTableRecords'

export class ReadTableRecord {
  private tableRepository: TableRepository

  constructor(tableRepository: TableRepository) {
    this.tableRepository = tableRepository
  }

  async execute(table: string, id: string): Promise<RecordDto> {
    const record = await this.tableRepository.read(table, id)
    return this.enrichRecord(record, table)
  }

  async enrichRecord(record: RecordDto, table: string) {
    const fields = await this.tableRepository.getTableFields(table)
    const fieldsRollup = fields.filter((f) => f.type === 'rollup')
    if (fieldsRollup.length > 0) {
      for (const fieldRollup of fieldsRollup)
        if (fieldRollup.type === 'rollup')
          await this.runFieldRollupFormula(record, fieldRollup, table)
    }
    const fieldsFormula = fields.filter((f) => f.type === 'formula')
    if (fieldsFormula.length > 0) {
      for (const fieldFormula of fieldsFormula)
        if (fieldFormula.type === 'formula') await this.runFieldFormula(record, fieldFormula)
    }
    return record
  }

  async runFieldRollupFormula(record: RecordDto, fieldRollup: FieldRollupDto, table: string) {
    const { formula } = fieldRollup
    const fields = await this.tableRepository.getTableFields(table)
    const field = fields.find((f) => f.name === fieldRollup.linked_records)
    if (!field || field.type !== 'multiple_linked_records') throw new Error('Field not found')
    const listTableRepository = new ListTableRecords(this.tableRepository)
    const linkedRecords = await listTableRepository.execute(field.table, [
      { field: 'id', operator: 'is_any_of', value: record[field.name] },
    ])
    const context = {
      values: linkedRecords.map((r) => r[fieldRollup.linked_field]),
    }
    const result = await this.tableRepository.runFormula(formula, context, this.getFunctions())
    record[fieldRollup.name] = result
  }

  async runFieldFormula(record: RecordDto, fieldRollup: FieldFormulaDto) {
    const { formula } = fieldRollup
    const context = record
    const result = await this.tableRepository.runFormula(formula, context, this.getFunctions())
    record[fieldRollup.name] = result
  }

  getFunctions(): { [key: string]: string } {
    return {
      sum: String((array: (number | string)[]) => array.reduce((a, b) => Number(a) + Number(b), 0)),
    }
  }
}

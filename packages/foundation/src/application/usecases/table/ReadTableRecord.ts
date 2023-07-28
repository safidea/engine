import { TableGateway } from '@adapter/spi/gateways/TableGateway'
import { ListTableRecords } from './ListTableRecords'
import { Rollup } from '@domain/entities/table/fields/Rollup'
import { Formula } from '@domain/entities/table/fields/Formula'
import { MultipleLinkedRecords } from '@domain/entities/table/fields/MultipleLinkedRecords'
import { mapRecordToDto } from '@application/mappers/table/RecordMapper'
import { RecordDto } from '@application/dtos/table/RecordDto'
import { runFormula } from '@application/utils/FormulaUtils'

export class ReadTableRecord {
  constructor(private TableGateway: TableGateway) {}

  async execute(table: string, id: string): Promise<RecordDto> {
    const record = await this.TableGateway.read(table, id)
    if (!record) throw new Error(`Record ${id} not found`)
    return this.enrichRecord(mapRecordToDto(record), table)
  }

  async enrichRecord(record: RecordDto, table: string) {
    const fields = await this.TableGateway.getTableFields(table)
    if (fields.length > 0) {
      for (const field of fields)
        if (field instanceof Rollup) await this.runFieldRollupFormula(record, field, table)
      for (const field of fields)
        if (field instanceof Formula) await this.runFieldFormula(record, field)
    }
    return record
  }

  async runFieldRollupFormula(record: RecordDto, fieldRollup: Rollup, table: string) {
    const { formula } = fieldRollup
    const fields = await this.TableGateway.getTableFields(table)
    const field = fields.find((f) => f.name === fieldRollup.linkedRecords)
    if (!field || !(field instanceof MultipleLinkedRecords)) throw new Error('Field not found')
    const listTableGateway = new ListTableRecords(this.TableGateway)
    const values = record[field.name]
    if (!Array.isArray(values)) throw new Error('Values are not an array')
    const linkedRecords = await listTableGateway.execute(field.table, [
      { field: 'id', operator: 'is_any_of', value: values },
    ])
    const context = {
      values: linkedRecords.map((record) => String(record[fieldRollup.linkedField])),
    }
    const result = await runFormula(formula, context, this.getFunctions())
    if (result) record[fieldRollup.name] = result
  }

  async runFieldFormula(record: RecordDto, fieldFormula: Formula) {
    const { formula } = fieldFormula
    const context = record
    const result = await runFormula(formula, context, this.getFunctions())
    if (result) record[fieldFormula.name] = result
  }

  getFunctions(): { [key: string]: string } {
    return {
      sum: String((array: (number | string)[]) => array.reduce((a, b) => Number(a) + Number(b), 0)),
    }
  }
}

import { OrmGateway } from '@adapter/spi/gateways/OrmGateway'
import { ListTableRecords } from './ListTableRecords'
import { Rollup } from '@domain/entities/table/fields/Rollup'
import { Formula } from '@domain/entities/table/fields/Formula'
import { MultipleLinkedRecords } from '@domain/entities/table/fields/MultipleLinkedRecords'
import { mapRecordToDto } from '@application/mappers/table/RecordMapper'
import { RecordDto } from '@application/dtos/table/RecordDto'
import { runFormula } from '@application/utils/FormulaUtils'
import { App } from '@domain/entities/App'

export class ReadTableRecord {
  constructor(
    private ormGateway: OrmGateway,
    private app: App
  ) {}

  async execute(table: string, id: string): Promise<RecordDto> {
    const record = await this.ormGateway.read(table, id)
    if (!record) throw new Error(`Record ${id} not found`)
    return this.runRecordFormulas(mapRecordToDto(record), table)
  }

  async runRecordFormulas(record: RecordDto, table: string) {
    const fields = this.app.getTableFields(table)
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
    const fields = this.app.getTableFields(table)
    const field = fields.find((f) => f.name === fieldRollup.linkedRecords)
    if (!field || !(field instanceof MultipleLinkedRecords)) throw new Error('Field not found')
    const listTableGateway = new ListTableRecords(this.ormGateway, this.app)
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
    if (formula.includes('total_net_amount') && context.total_net_amount == null)
      console.log('runFieldFormula', formula, context)
    const result = await runFormula(formula, context, this.getFunctions())
    record[fieldFormula.name] = result
  }

  getFunctions(): { [key: string]: string } {
    return {
      sum: String((array: (number | string)[]) => array.reduce((a, b) => Number(a) + Number(b), 0)),
    }
  }
}

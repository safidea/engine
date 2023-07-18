import { Field } from './Field'

export class FieldRollup extends Field {
  public type = 'rollup'
  public linked_records: string
  public linked_field: string
  public formula: string
  public format?: 'currency'

  constructor(schema: FieldRollup) {
    super(schema)
    this.linked_records = schema.linked_records
    this.linked_field = schema.linked_field
    this.formula = schema.formula
    this.format = schema.format
  }
}

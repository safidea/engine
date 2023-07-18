import { Field } from './Field'

export class FieldFormula extends Field {
  public type = 'formula'
  public formula: string
  public format?: 'currency'

  constructor(schema: FieldFormula) {
    super(schema)
    this.formula = schema.formula
    this.format = schema.format
  }
}

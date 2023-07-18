import { Field } from './Field'

export class FieldCurrency extends Field {
  public type = 'currency'

  constructor(schema: FieldCurrency) {
    super(schema)
  }
}

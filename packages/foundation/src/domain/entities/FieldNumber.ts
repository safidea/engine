import { Field } from './Field'

export class FieldNumber extends Field {
  public type = 'number'

  constructor(schema: FieldNumber) {
    super(schema)
  }
}

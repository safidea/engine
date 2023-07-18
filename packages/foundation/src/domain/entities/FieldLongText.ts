import { Field } from './Field'

export class FieldLongText extends Field {
  public type = 'long_text'

  constructor(schema: FieldLongText) {
    super(schema)
  }
}

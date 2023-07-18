import { Field } from './Field'

export class FieldSingleLinkRecord extends Field {
  public table: string
  public type = 'single_linked_record'

  constructor(schema: FieldSingleLinkRecord) {
    super(schema)
    this.table = schema.table
  }
}

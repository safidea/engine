import { Field } from './Field'

export class FieldMultipleLinkedRecord extends Field {
  public table: string
  public type = 'multiple_linked_records'

  constructor(schema: FieldMultipleLinkedRecord) {
    super(schema)
    this.table = schema.table
  }
}

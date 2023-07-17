import { Field } from './Field'

export class Table {
  public name: string
  public fields: Field[]

  constructor(schema: Table) {
    this.name = schema.name
    this.fields = schema.fields.map((field) => new Field(field))
  }
}

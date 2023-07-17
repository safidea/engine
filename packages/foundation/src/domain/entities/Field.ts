export class Field {
  public name: string
  public type: string
  public required?: boolean

  constructor(schema: Field) {
    this.name = schema.name
    this.type = schema.type
    this.required = schema.required
  }
}

export class Field {
  public name: string
  public type: string
  public optional?: boolean

  constructor(schema: Field) {
    this.name = schema.name
    this.type = schema.type ?? 'single_line_text'
    this.optional = schema.optional ?? true
  }
}

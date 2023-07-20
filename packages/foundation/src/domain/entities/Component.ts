export class Component {
  public key: string
  public text?: string
  public href?: string

  constructor(schema: Component) {
    this.key = schema.key
    this.text = schema.text
    this.href = schema.href
  }
}

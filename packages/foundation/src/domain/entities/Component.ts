export class Component {
  public key: string
  public text?: string

  constructor(schema: Component) {
    this.key = schema.key
    this.text = schema.text
  }
}

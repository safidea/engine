export class Foundation {
  public name: string
  public version: string

  constructor(config: Foundation) {
    this.name = config.name
    this.version = config.version
  }
}

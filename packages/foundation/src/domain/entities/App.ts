export class App {
  public name: string
  public version: string

  constructor(config: App) {
    this.name = config.name
    this.version = config.version
  }
}

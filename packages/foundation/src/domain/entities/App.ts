import { Page } from './Page'
export class App {
  public name: string
  public version: string
  public pages: Page[]

  constructor(schema: App) {
    this.name = schema.name
    this.version = schema.version
    this.pages = schema.pages.map((page) => new Page(page))
  }
}

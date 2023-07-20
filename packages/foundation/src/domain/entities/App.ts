import { Page } from './Page'
import { Table } from './Table'
export class App {
  public name: string
  public version: string
  public pages: Page[]
  public tables: Table[]

  constructor(schema: App) {
    this.name = schema.name
    this.version = schema.version
    this.pages = schema.pages.map((page) => new Page(page as any))
    this.tables = schema.tables.map((table) => new Table(table))
  }
}

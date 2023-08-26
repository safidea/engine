import { Automation } from '../automation/Automation'
import { Page } from '../page/Page'
import { Field } from '../table/Field'
import { Table } from '../table/Table'

export class App {
  constructor(
    private readonly _name: string = 'My app',
    private readonly _version: string = '0.0.1',
    private readonly _pages: Page[] = [],
    private readonly _tables: Table[] = [],
    private readonly _automations: Automation[] = []
  ) {}

  get name(): string {
    return this._name
  }

  get version(): string {
    return this._version
  }

  get pages(): Page[] {
    return this._pages
  }

  get tables(): Table[] {
    return this._tables
  }

  get automations(): Automation[] {
    return this._automations
  }

  getTableFields(tableName: string): Field[] {
    const table = this.getTableByName(tableName)
    return table.fields
  }

  getTableByName(tableName: string): Table {
    const tables = this._tables
    if (!tables) throw new Error('Tables not found in app')
    const table = tables.find((t) => t.name === tableName)
    if (!table) throw new Error(`Table ${tableName} not found`)
    return table
  }

  getPageByPath(path: string): Page {
    const pages = this._pages
    if (!pages) throw new Error('Pages not found in app')
    const page = pages.find((p) => this.matchPath(p.path, path))
    if (!page) throw new Error(`Page ${path} not found`)
    return page
  }

  private matchPath(pagePath: string, path: string): boolean {
    const pagePathParts = pagePath.split('/').filter(Boolean)
    const pathParts = path.split('/').filter(Boolean)
    if (pagePathParts.length !== pathParts.length) return false
    return pagePathParts.every((part, i) => {
      if (part.startsWith(':')) return true
      return part === pathParts[i]
    })
  }
}

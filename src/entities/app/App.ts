import { Automation } from './automation/Automation'
import { Page } from './page/Page'
import { Field } from './table/Field'
import { Table } from './table/Table'

export interface AppOptions {
  readonly name: string
  readonly version: string
  readonly pages: PageOptions[]
  readonly tables: TableOptions[]
  readonly automations: AutomationOptions[]
}

export interface AppDrivers {
  readonly templater: ITemplatingSpi
  readonly converter: IConverterSpi
  readonly storage: IStorageSpi
  readonly database: IDatabaseSpi
  readonly fetcher: IFetcherSpi
  readonly logger: ILoggerSpi
}

export class App {
  constructor(options: AppOptions, drivers: AppDrivers) {}

  getTableFields(tableName: string): Field[] {
    const table = this.getTableByName(tableName)
    return table.fields
  }

  getTableByName(tableName: string): Table {
    const tables = this.tables
    if (!tables) throw new Error('Tables not found in app')
    const table = tables.find((t) => t.name === tableName)
    if (!table) throw new Error(`Table ${tableName} not found`)
    return table
  }

  getPageByPath(path: string): Page {
    const pages = this.pages
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

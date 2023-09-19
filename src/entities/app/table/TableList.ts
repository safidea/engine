import { AppServices } from '../AppServices'
import { Table } from './Table'
import { TableParams } from './TableParams'
import { TableServices } from './TableServices'

export class TableList {
  private readonly tables: Table[]
  readonly services: TableServices

  constructor(tables: TableParams[], services: AppServices) {
    const { database } = services
    if (!database) throw new Error('Database service is required')
    this.services = { database }
    this.tables = tables.map((table) => new Table(table, this.services))
  }

  getByName(tableName: string): Table | undefined {
    return this.tables.find((t: Table) => t.name === tableName)
  }

  getAll(): Table[] {
    return this.tables
  }

  getAllParams(): TableParams[] {
    return this.tables.map((table: Table) => table.params)
  }

  getNames(): string[] {
    return this.tables.map((table: Table) => table.name)
  }

  exist(): boolean {
    return this.tables.length > 0
  }
}

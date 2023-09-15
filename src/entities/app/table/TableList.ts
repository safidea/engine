import { AppDrivers } from '../App'
import { Table } from './Table'
import { TableParams } from './TableParams'

export class TableList {
  private readonly tables: Table[]

  constructor(tables: TableParams[], drivers: AppDrivers) {
    this.tables = tables.map((table) => new Table(table, drivers))
  }

  getByName(tableName: string): Table | undefined {
    return this.tables.find((t: Table) => t.name === tableName)
  }

  getAll(): Table[] {
    return this.tables
  }
}

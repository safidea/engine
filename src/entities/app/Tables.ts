import { Table } from './table/Table'

export class Tables {
  constructor(private options: TableOptions[]) {}

  getByName(tableName: string): Table | undefined {
    return this.tables.find((t: Table) => t.name === tableName)
  }
}

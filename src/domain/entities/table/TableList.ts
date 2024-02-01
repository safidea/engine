import type { EngineError } from '../EngineError.ts'
import type { EngineList } from '../EngineList.ts'
import { Table, type TableConfig, type TableParams } from './Table.tsx'

export class TableList implements EngineList<Table> {
  private tables: Table[]

  constructor(config: TableConfig[], params: TableParams) {
    this.tables = config.map((table) => new Table(table, params))
  }

  get length() {
    return this.tables.length
  }

  get all() {
    return this.tables
  }

  validateConfig(): EngineError[] {
    return this.tables.flatMap((table) => table.validateConfig())
  }

  includes(name: string) {
    return this.tables.some((table) => table.name === name)
  }

  find(name: string) {
    return this.tables.find((table) => table.name === name)
  }
}

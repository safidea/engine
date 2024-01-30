import type { EngineError } from '../EngineError.ts'
import type { IList } from '../IList.ts'
import type { TableDto } from './TableDto.ts'
import type { TableParams } from './TableParams.ts'
import { Table } from './Table.tsx'

export class TableList implements IList<Table> {
  private tables: Table[]

  constructor(config: TableDto[], params: TableParams) {
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

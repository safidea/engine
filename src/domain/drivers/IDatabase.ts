import type { TableList } from '@domain/entities/table/TableList'

export interface IDatabaseRow {
  [key: string]: string | number | boolean | undefined
}

export interface IDatabaseTable {
  create: (data: IDatabaseRow) => Promise<void>
  find: (data: IDatabaseRow) => Promise<IDatabaseRow>
}

export interface IDatabaseInstance {
  table: (name: string) => IDatabaseTable
}

export interface IDatabase {
  create(tables: TableList): IDatabaseInstance
}

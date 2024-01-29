import type { ITable } from '@domain/entities/table/ITable'

export interface IDatabaseRow {
  [key: string]: string | number | boolean | undefined
}

export interface IDatabaseTable {
  insert: (data: IDatabaseRow) => Promise<IDatabaseRow>
  read: (data: IDatabaseRow) => Promise<IDatabaseRow | undefined>
}

export interface IDatabaseInstance {
  migrate: () => Promise<void>
  disconnect: () => Promise<void>
  table: (name: string) => IDatabaseTable
}

export interface IDatabase {
  create(tables: ITable[]): IDatabaseInstance
}

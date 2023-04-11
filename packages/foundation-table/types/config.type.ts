import { Table } from './table.type'

export type Tables = {
  [key: string]: Table
}

export type Config = {
  tables: Tables
}

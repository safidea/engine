import { Table } from './table.type'

export type Database = {
  url: string
  provider: 'sqlite' | 'mysql' | 'postgresql' | 'sqlserver' | 'mongodb' | 'cockroachdb',
  accounts: boolean
}

export type Tables = {
  [key: string]: Table
}

export type Config = {
  database: Database
  tables: Tables
}

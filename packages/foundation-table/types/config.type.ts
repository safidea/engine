import { Table } from './table.type'

export type Config = {
  database: {
    url: string
    provider: 'sqlite' | 'mysql' | 'postgresql' | 'sqlserver' | 'mongodb' | 'cockroachdb'
  }
  tables: {
    [key: string]: Table
  }
}

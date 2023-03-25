import Table from './table'

export type Database = {
  database: {
    url: string
    provider: 'sqlite' | 'mysql' | 'postgresql' | 'sqlserver' | 'mongodb' | 'cockroachdb'
  }
  tables: {
    [key: string]: Table
  }
}

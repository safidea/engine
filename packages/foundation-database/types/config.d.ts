import Table from './table'

export type Config = {
  database: {
    url: string
    provider: 'sqlite' | 'mysql' | 'postgresql' | 'sqlserver' | 'mongodb' | 'cockroachdb'
  }
  tables: {
    [key: string]: Table
  }
}

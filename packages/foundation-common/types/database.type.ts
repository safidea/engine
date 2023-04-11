export type Database = {
  url: string
  provider: 'sqlite' | 'mysql' | 'postgresql' | 'sqlserver' | 'mongodb' | 'cockroachdb'
  accounts: boolean
}

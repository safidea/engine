import type { ObjectInterface } from 'server-common'

export interface DatabaseInterface extends ObjectInterface {
  url: string
  provider: 'sqlite' | 'mysql' | 'postgresql' | 'sqlserver' | 'mongodb' | 'cockroachdb'
}

export interface DatabasesInterface extends ObjectInterface {
  [key: string]: DatabaseInterface
}

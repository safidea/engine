import type { ObjectInterface } from 'foundation-common'

export interface DatabaseInterface extends ObjectInterface {
  url: string
  provider: 'sqlite' | 'mysql' | 'postgresql' | 'sqlserver' | 'mongodb' | 'cockroachdb'
}

export interface DatabasesInterface extends ObjectInterface {
  [key: string]: DatabaseInterface
}

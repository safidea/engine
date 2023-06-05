import type { ObjectInterface } from 'shared-common'

export interface DatabaseInterface extends ObjectInterface {
  url: string
  provider: 'sqlite' | 'mysql' | 'postgresql' | 'sqlserver' | 'mongodb' | 'cockroachdb'
}

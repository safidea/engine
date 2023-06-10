import type { ObjectInterface } from 'shared-common'
import type { TablesInterface } from 'shared-table'
import type { DatabaseInterface } from 'shared-database'
import type { PagesInterface } from 'shared-page'
import type { ComponentsInterface } from 'shared-component'

export interface AppInterface extends ObjectInterface {
  name: string
  version: string
}

export interface ConfigInterface extends AppInterface {
  tables?: TablesInterface
  database?: DatabaseInterface
  pages?: PagesInterface
  components?: ComponentsInterface
}

export interface EnvInterface {
  DATABASE_URL?: string
  PORT?: string
  DEBUG?: string
}

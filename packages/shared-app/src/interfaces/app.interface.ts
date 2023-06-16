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
  DATABASE_HOST?: string
  DATABASE_PORT?: string
  DATABASE_NAME?: string
  DATABASE_USER?: string
  DATABASE_PASSWORD?: string
  PRISMA_BINARY_TARGETS?: string
  PORT?: string
  DEBUG?: string
  APP_PATH?: string
  APP_NAME?: string
}

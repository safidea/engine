export * from 'shared-database'

export { default as DatabaseService } from './services/database.service'
export { default as DatabaseConfig } from './configs/database.config'

export type {
  OrmProviderInterface,
  OrmProviderTableInterface,
  OrmProviderTablesInterface,
  OrmProviderConstructorInterface,
} from './interfaces/orm.interface'

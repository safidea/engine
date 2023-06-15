export * from 'shared-database'

export { default as DatabaseService } from './services/database.service'
export { default as DatabaseConfig } from './configs/database.config'

export type {
  DatabaseProviderInterface,
  DatabaseProviderTableInterface,
  DatabaseProviderConstructorInterface,
} from './interfaces/database.interface'

import type { IServerDriver } from './IServerDriver'
import type { ILoggerDriver } from './ILoggerDriver'
import type { IDatabaseDriver } from './IDatabaseDriver'
import type { ISchemaValidatorDriver } from './ISchemaValidatorDriver'
import type { IIdGeneratorDriver } from './IIdGeneratorDriver'
import type { IUiDriver } from './IUiDriver'
import type { IBrowserDriver } from './IBrowserDriver'

export interface IDrivers {
  server: () => IServerDriver
  logger: (location: string) => ILoggerDriver
  database: () => IDatabaseDriver
  idGenerator: () => IIdGeneratorDriver
  schemaValidator: () => ISchemaValidatorDriver
  browser: () => IBrowserDriver
  ui: () => IUiDriver
}

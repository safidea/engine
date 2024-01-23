import type { ISchemaValidator } from './ISchemaValidator'
import type { IBrowser } from './IBrowser'
import type { IServer } from './IServer'
import type { ILogger } from './ILogger'

export interface Drivers {
  schemaValidator: ISchemaValidator
  browser: IBrowser
  server: IServer
  logger: ILogger
}

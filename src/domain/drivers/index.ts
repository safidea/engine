import type { ISchemaValidator } from './ISchemaValidator'
import type { IBrowser } from './IBrowser'
import type { IServer } from './server/IServer'
import type { ILogger } from './ILogger'
import type { IUi } from './IUi'
import type { IDatabase } from './IDatabase'

export interface Drivers {
  schemaValidator: ISchemaValidator
  browser: IBrowser
  server: IServer
  logger: ILogger
  ui: IUi
  database: IDatabase
}

import type { ISchemaValidator } from './ISchemaValidator'
import type { IBrowser } from './IBrowser'
import type { IServer } from './server/IServer'
import type { ILogger } from './ILogger'
import type { IUi } from './IUi'
import type { IDatabase } from './IDatabase'
import type { IIdGeneratorDriver } from 'src/mappers/services/idGenerator/IIdGeneratorDriver'

export interface Drivers {
  schemaValidator: ISchemaValidator
  browser: IBrowser
  server: IServer
  logger: ILogger
  ui: IUi
  database: IDatabase
  idGenerator: IIdGeneratorDriver
}

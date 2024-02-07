import { PuppeteerBrowserDriver } from './PuppeteerBrowserDriver'
import { AJVSchemaValidatorDriver } from './AJVSchemaValidatorDriver'
import { ExpressServerDriver } from './ExpressServerDriver'
import { DebugLoggerDriver } from './DebugLoggerDriver'
import { ReactUiDriver } from './ReactUiDriver'
import { KyselyDatabaseDriver } from './KyselyDatabaseDriver'
import { NanoidIdGeneratorDriver } from './NanoidIdGeneratorDriver'
import type { Drivers } from '@adapter/spi'
import { client } from '@infrastructure/client/ui'
import type { Params as ServerParams } from '@domain/services/Server'
import type { Params as DatabaseParams } from '@domain/services/Database'
import type { Params as SchemaValidatorParams } from '@domain/services/SchemaValidator'
import type { Params as LoggerParams } from '@domain/services/Logger'

export const drivers: Drivers = {
  schemaValidator: (params: SchemaValidatorParams) => new AJVSchemaValidatorDriver(params),
  browser: () => new PuppeteerBrowserDriver(),
  server: (params: ServerParams) => new ExpressServerDriver(params),
  logger: (params: LoggerParams) => new DebugLoggerDriver(params),
  ui: () => new ReactUiDriver(client),
  database: (params: DatabaseParams) => new KyselyDatabaseDriver(params),
  idGenerator: () => new NanoidIdGeneratorDriver(),
}

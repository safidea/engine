import { PuppeteerBrowserDriver } from './PuppeteerBrowserDriver'
import { AJVSchemaValidatorDriver } from './AJVSchemaValidatorDriver'
import { ExpressServerDriver } from './ExpressServerDriver'
import { DebugLoggerDriver } from './DebugLoggerDriver'
import { ReactUIDriver } from './ReactUIDriver'
import { KyselyDatabaseDriver } from './KyselyDatabaseDriver'
import { NanoidIdGeneratorDriver } from './NanoidIdGeneratorDriver'
import type { Drivers } from '@adapter/spi'

export const drivers: Drivers = {
  schemaValidator: () => new AJVSchemaValidatorDriver(),
  browser: () => new PuppeteerBrowserDriver(),
  server: (port?: number) => new ExpressServerDriver(port),
  logger: (location: string) => new DebugLoggerDriver(location),
  ui: () => new ReactUIDriver(),
  database: () => new KyselyDatabaseDriver(),
  idGenerator: () => new NanoidIdGeneratorDriver(),
}

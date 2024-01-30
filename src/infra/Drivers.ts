import { BrowserDriver } from './BrowserDriver'
import { SchemaValidatorDriver } from './SchemaValidatorDriver'
import { ServerDriver } from './ServerDriver'
import { LoggerDriver } from './LoggerDriver'
import { UiDriver } from './UiDriver'
import { DatabaseDriver } from './DatabaseDriver'
import { IdGeneratorDriver } from './IdGeneratorDriver'
import type { IDrivers } from '@adapter/spi/drivers/IDrivers'

export const drivers: IDrivers = {
  schemaValidator: () => new SchemaValidatorDriver(),
  browser: () => new BrowserDriver(),
  server: (port?: number) => new ServerDriver(port),
  logger: (location: string) => new LoggerDriver(location),
  ui: () => new UiDriver(),
  database: () => new DatabaseDriver(),
  idGenerator: () => new IdGeneratorDriver(),
}

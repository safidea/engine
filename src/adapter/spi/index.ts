import type { SPIs as ISPIs } from '@domain/services'
import type { BrowserDriver } from './BrowserSPI'
import { DatabaseSPI, type DatabaseDriver } from './DatabaseSPI'
import { IdGeneratorSPI, type IdGeneratorDriver } from './IdGeneratorSPI'
import { LoggerSPI, type LoggerDriver } from './LoggerSPI'
import { SchemaValidatorSPI, type SchemaValidatorDriver } from './SchemaValidatorSPI'
import { ServerSPI, type ServerDriver } from './ServerSPI'
import type { UIDriver } from './UISPI'

export interface Drivers {
  server: () => ServerDriver
  logger: (location: string) => LoggerDriver
  database: () => DatabaseDriver
  idGenerator: () => IdGeneratorDriver
  schemaValidator: () => SchemaValidatorDriver
  browser: () => BrowserDriver
  ui: () => UIDriver
}

export class SPIs implements ISPIs {
  constructor(private drivers: Drivers) {}

  database = () => new DatabaseSPI(this.drivers.database())
  server = () => new ServerSPI(this.drivers.server())
  idGenerator = () => new IdGeneratorSPI(this.drivers.idGenerator())
  logger = (location: string) => new LoggerSPI(this.drivers.logger(location))
  schemaValidator = () => new SchemaValidatorSPI(this.drivers.schemaValidator())
  ui = () => this.drivers.ui()
}

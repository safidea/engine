import type { Spis as ISpis } from '@domain/services'
import type { BrowserDriver } from './BrowserSpi'
import { DatabaseSpi, type DatabaseDriver } from './DatabaseSpi'
import { IdGeneratorSpi, type IdGeneratorDriver } from './IdGeneratorSpi'
import { LoggerSpi, type LoggerDriver } from './LoggerSpi'
import { SchemaValidatorSpi, type SchemaValidatorDriver } from './SchemaValidatorSpi'
import { ServerSpi, type ServerDriver } from './ServerSpi'
import type { UiDriver } from './UiSpi'
import type { ReactComponents } from '@domain/entities/Component'

export interface Drivers {
  server: () => ServerDriver
  logger: (location: string) => LoggerDriver
  database: () => DatabaseDriver
  idGenerator: () => IdGeneratorDriver
  schemaValidator: () => SchemaValidatorDriver
  browser: () => BrowserDriver
  ui: () => UiDriver
}

export class Spis implements ISpis {
  constructor(
    private drivers: Drivers,
    public components: ReactComponents
  ) {}

  database = () => new DatabaseSpi(this.drivers.database())
  server = () => new ServerSpi(this.drivers.server())
  idGenerator = () => new IdGeneratorSpi(this.drivers.idGenerator())
  logger = (location: string) => new LoggerSpi(this.drivers.logger(location))
  schemaValidator = () => new SchemaValidatorSpi(this.drivers.schemaValidator())
  ui = () => this.drivers.ui()
}

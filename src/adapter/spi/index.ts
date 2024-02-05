import type { Spis as ISpis } from '@domain/services'
import { BrowserSpi, type BrowserDriver } from './BrowserSpi'
import { DatabaseSpi, type DatabaseDriver } from './DatabaseSpi'
import { IdGeneratorSpi, type IdGeneratorDriver } from './IdGeneratorSpi'
import { LoggerSpi, type LoggerDriver } from './LoggerSpi'
import { SchemaValidatorSpi, type SchemaValidatorDriver } from './SchemaValidatorSpi'
import { ServerSpi, type ServerDriver } from './ServerSpi'
import type { UiDriver } from './UiSpi'
import type { ReactComponents } from '@domain/entities/page/Component'

export interface Drivers {
  server: (port?: number) => ServerDriver
  logger: (location: string) => LoggerDriver
  database: (url?: string) => DatabaseDriver
  idGenerator: () => IdGeneratorDriver
  schemaValidator: () => SchemaValidatorDriver
  browser: () => BrowserDriver
  ui: () => UiDriver
}

export interface Params {
  drivers: Drivers
  components: ReactComponents
  databaseUrl?: string
  port?: number
}

export class Spis implements ISpis {
  constructor(private params: Params) {}

  get components() {
    return this.params.components
  }

  database = () => new DatabaseSpi(this.params.drivers.database(this.params.databaseUrl))
  server = () => new ServerSpi(this.params.drivers.server(this.params.port))
  idGenerator = () => new IdGeneratorSpi(this.params.drivers.idGenerator())
  logger = (location: string) => new LoggerSpi(this.params.drivers.logger(location))
  schemaValidator = () => new SchemaValidatorSpi(this.params.drivers.schemaValidator())
  ui = () => this.params.drivers.ui()
  browser = () => new BrowserSpi(this.params.drivers.browser())
}

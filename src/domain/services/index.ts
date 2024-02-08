import { Database, type Spi as DatabaseSpi, type Params as DatabaseParams } from './Database'
import { IdGenerator, type Spi as IdGeneratorSpi } from './IdGenerator'
import { Logger, type Spi as LoggerSpi, type Params as LoggerParams } from './Logger'
import { Record } from './record'
import {
  SchemaValidator,
  type Spi as SchemaValidatorSpi,
  type Params as SchemaValidatorParams,
} from './SchemaValidator'
import { Server, type Spi as ServerSpi, type Params as ServerParams } from './Server'
import { Ui, type Spi as UiSpi } from './Ui'
import type { ReactComponents } from '@domain/entities/page/component'
import { Browser, type Spi as BrowserSpi } from './Browser'
import { Queue, type Spi as QueueSpi, type Params as QueueParams } from './Queue'

export interface Spis {
  components: ReactComponents
  server: (params: ServerParams) => ServerSpi
  database: (params: DatabaseParams) => DatabaseSpi
  logger: (params: LoggerParams) => LoggerSpi
  idGenerator: () => IdGeneratorSpi
  schemaValidator: (params: SchemaValidatorParams) => SchemaValidatorSpi
  ui: () => UiSpi
  browser: () => BrowserSpi
  queue: (params: QueueParams) => QueueSpi
}

export class Services {
  components: ReactComponents

  constructor(private spis: Spis) {
    this.components = this.spis.components
  }

  logger = (params: LoggerParams) => new Logger(this.spis.logger(params))

  idGenerator = () => new IdGenerator(this.spis.idGenerator())

  database = (params: DatabaseParams) => new Database(this.spis.database(params))

  server = (params: ServerParams) => new Server(this.spis.server(params))

  schemaValidator = (params: SchemaValidatorParams) =>
    new SchemaValidator(this.spis.schemaValidator(params))

  ui = () => new Ui(this.spis.ui())

  browser = () => new Browser(this.spis.browser())

  queue = (params: QueueParams) => new Queue(this.spis.queue(params))

  record = () => new Record({ idGenerator: this.idGenerator() })
}

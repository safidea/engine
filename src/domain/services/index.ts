import { Database, type Spi as DatabaseSpi, type Params as DatabaseParams } from './Database'
import { IdGenerator, type Spi as IdGeneratorSpi } from './IdGenerator'
import { Logger, type Spi as LoggerSpi, type Params as LoggerParams } from './Logger'
import { Record } from '../entities/record'
import { SchemaValidator, type Spi as SchemaValidatorSpi } from './SchemaValidator'
import { Server, type Spi as ServerSpi, type Params as ServerParams } from './Server'
import { Ui, type Spi as UiSpi } from './Ui'
import type { ReactComponents } from '@domain/engine/page/component'
import { Browser, type Spi as BrowserSpi } from './Browser'
import { Queue, type Spi as QueueSpi, type Params as QueueParams } from './Queue'
import { Mailer, type Spi as MailerSpi, type Params as MailerParams } from './Mailer'
import { TemplateCompiler, type Spi as TemplateCompilerSpi } from './TemplateCompiler'
import { Realtime, type Spi as RealtimeSpi, type Params as RealtimeParams } from './Realtime'
import { Auth, type Spi as AuthSpi, type Params as AuthParams } from './Auth'
import { Client, type Spi as ClientSpi } from './Client'

export interface Spis {
  components: ReactComponents
  server: (params: ServerParams) => ServerSpi
  database: (params: DatabaseParams) => DatabaseSpi
  logger: (params: LoggerParams) => LoggerSpi
  queue: (params: QueueParams) => QueueSpi
  mailer: (params: MailerParams) => MailerSpi
  realtime: (params: RealtimeParams) => RealtimeSpi
  auth: (params: AuthParams) => AuthSpi
  idGenerator: () => IdGeneratorSpi
  schemaValidator: () => SchemaValidatorSpi
  ui: () => UiSpi
  client: () => ClientSpi
  browser: () => BrowserSpi
  templateCompiler: () => TemplateCompilerSpi
}

export class Services {
  components: ReactComponents

  constructor(private spis: Spis) {
    this.components = this.spis.components
  }

  logger = (params: LoggerParams) => new Logger(this.spis.logger(params))

  queue = (params: QueueParams) => new Queue(this.spis.queue(params))

  mailer = (params: MailerParams) => new Mailer(this.spis.mailer(params))

  database = (params: DatabaseParams) => new Database(this.spis.database(params))

  server = (params: ServerParams) => new Server(this.spis.server(params))

  realtime = (params: RealtimeParams) => new Realtime(this.spis.realtime(params))

  auth = (params: AuthParams) => new Auth(this.spis.auth(params))

  schemaValidator = () => new SchemaValidator(this.spis.schemaValidator())

  ui = () => new Ui(this.spis.ui())

  client = () => new Client(this.spis.client())

  browser = () => new Browser(this.spis.browser())

  idGenerator = () => new IdGenerator(this.spis.idGenerator())

  templateCompiler = () => new TemplateCompiler(this.spis.templateCompiler())

  record = () =>
    new Record({ idGenerator: this.idGenerator(), templateCompiler: this.templateCompiler() })
}

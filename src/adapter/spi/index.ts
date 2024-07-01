import type { Spis as ISpis } from '@domain/services'
import { BrowserSpi, type Driver as BrowserDriver } from './BrowserSpi'
import { DatabaseSpi, type Driver as DatabaseDriver } from './DatabaseSpi'
import { IdGeneratorSpi, type Driver as IdGeneratorDriver } from './IdGeneratorSpi'
import { LoggerSpi, type Driver as LoggerDriver } from './LoggerSpi'
import { SchemaValidatorSpi, type Driver as SchemaValidatorDriver } from './SchemaValidatorSpi'
import { ServerSpi, type Driver as ServerDriver } from './ServerSpi'
import { UiSpi, type Driver as UiDriver } from './UiSpi'
import type { Params as ServerParams } from '@domain/services/Server'
import type { Params as DatabaseParams } from '@domain/services/Database'
import type { Params as LoggerParams } from '@domain/services/Logger'
import type { Params as QueueParams } from '@domain/services/Queue'
import type { Params as RealtimeParams } from '@domain/services/Realtime'
import type { Params as AuthParams } from '@domain/services/Auth'
import { QueueSpi, type Driver as QueueDriver } from './QueueSpi'
import type { Params as MailerParams } from '@domain/services/Mailer'
import { MailerSpi, type Driver as MailerDriver } from './MailerSpi'
import { TemplateCompilerSpi, type Driver as TemplateCompilerDriver } from './TemplateCompilerSpi'
import { RealtimeSpi, type Driver as RealtimeDriver } from './RealtimeSpi'
import { AuthSpi, type Driver as AuthDriver } from './AuthSpi'
import { ClientSpi, type Driver as ClientDriver } from './ClientSpi'
import type { ReactComponents } from '@domain/engine/page/component'

export interface Drivers {
  server: (params: ServerParams) => ServerDriver
  logger: (params: LoggerParams) => LoggerDriver
  database: (params: DatabaseParams) => DatabaseDriver
  queue: (params: QueueParams) => QueueDriver
  mailer: (params: MailerParams) => MailerDriver
  realtime: (params: RealtimeParams) => RealtimeDriver
  auth: (params: AuthParams) => AuthDriver
  idGenerator: () => IdGeneratorDriver
  schemaValidator: () => SchemaValidatorDriver
  browser: () => BrowserDriver
  ui: () => UiDriver
  client: () => ClientDriver
  templateCompiler: () => TemplateCompilerDriver
}

export interface Params {
  drivers: Drivers
  components: ReactComponents
}

export class Spis implements ISpis {
  constructor(private params: Params) {}

  get components() {
    return this.params.components
  }

  database = (params: DatabaseParams) => new DatabaseSpi(this.params.drivers.database(params))

  server = (params: ServerParams) => new ServerSpi(this.params.drivers.server(params))

  queue = (params: QueueParams) => new QueueSpi(this.params.drivers.queue(params))

  mailer = (params: MailerParams) => new MailerSpi(this.params.drivers.mailer(params))

  logger = (params: LoggerParams) => new LoggerSpi(this.params.drivers.logger(params))

  realtime = (params: RealtimeParams) => new RealtimeSpi(this.params.drivers.realtime(params))

  auth = (params: AuthParams) => new AuthSpi(this.params.drivers.auth(params))

  schemaValidator = () => new SchemaValidatorSpi(this.params.drivers.schemaValidator())

  ui = () => new UiSpi(this.params.drivers.ui())

  client = () => new ClientSpi(this.params.drivers.client())

  browser = () => new BrowserSpi(this.params.drivers.browser())

  idGenerator = () => new IdGeneratorSpi(this.params.drivers.idGenerator())

  templateCompiler = () => new TemplateCompilerSpi(this.params.drivers.templateCompiler())
}

import type { Drivers } from '@adapter/spi'
import type { Params as ServerParams } from '@domain/services/Server'
import type { Params as DatabaseParams } from '@domain/services/Database'
import type { Params as LoggerParams } from '@domain/services/Logger'
import type { Params as QueueParams } from '@domain/services/Queue'
import type { Params as MailerParams } from '@domain/services/Mailer'
import type { Params as RealtimeParams } from '@domain/services/Realtime'
import type { Params as AuthParams } from '@domain/services/Auth'
import type { Params as MarkdownParserParams } from '@domain/services/MarkdownParser'
import { SchemaValidatorDriver } from './SchemaValidatorDriver'
import { BrowserDriver } from './BrowserDriver'
import { ServerDriver } from './ServerDriver'
import { LoggerDriver } from './LoggerDriver'
import { IdGeneratorDriver } from './IdGeneratorDriver'
import { DatabaseDriver } from './DatabaseDriver'
import { UiDriver } from './UiDriver'
import { QueueDriver } from './QueueDriver'
import { MailerDriver } from './MailerDriver'
import { TemplateCompilerDriver } from './TemplateCompilerDriver'
import { RealtimeDriver } from './RealtimeDriver'
import { AuthDriver } from './AuthDriver'
import { ClientDriver } from './ClientDriver'
import { MarkdownParserDriver } from './MarkdownParserDriver'
import { ThemeDriver } from './ThemeDriver'

export const drivers: Drivers = {
  server: (params: ServerParams) => new ServerDriver(params),
  logger: (params: LoggerParams) => new LoggerDriver(params),
  database: (params: DatabaseParams) => new DatabaseDriver(params),
  queue: (params: QueueParams) => new QueueDriver(params),
  mailer: (params: MailerParams) => new MailerDriver(params),
  realtime: (params: RealtimeParams) => new RealtimeDriver(params),
  auth: (params: AuthParams) => new AuthDriver(params),
  markdownParser: (params: MarkdownParserParams) => new MarkdownParserDriver(params),
  templateCompiler: () => new TemplateCompilerDriver(),
  schemaValidator: () => new SchemaValidatorDriver(),
  browser: () => new BrowserDriver(),
  ui: () => new UiDriver(),
  client: () => new ClientDriver(),
  idGenerator: () => new IdGeneratorDriver(),
  theme: () => new ThemeDriver(),
}

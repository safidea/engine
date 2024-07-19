import { type Driver as BrowserDriver } from './BrowserSpi'
import { type Driver as DatabaseDriver } from './DatabaseSpi'
import { type Driver as IdGeneratorDriver } from './IdGeneratorSpi'
import { type Driver as LoggerDriver } from './LoggerSpi'
import { type Driver as SchemaValidatorDriver } from './SchemaValidatorSpi'
import { type Driver as ServerDriver } from './ServerSpi'
import { type Driver as UiDriver } from './UiSpi'
import type { Config as ServerConfig } from '@domain/services/Server'
import type { Config as DatabaseConfig } from '@domain/services/Database'
import type { Config as QueueConfig } from '@domain/services/Queue'
import type { Config as RealtimeConfig } from '@domain/services/Realtime'
import type { Config as AuthConfig } from '@domain/services/Auth'
import type { Config as ThemeConfig } from '@domain/services/Theme'
import { type Driver as QueueDriver } from './QueueSpi'
import type { Config as MailerConfig } from '@domain/services/Mailer'
import { type Driver as MailerDriver } from './MailerSpi'
import { type Driver as TemplateCompilerDriver } from './TemplateCompilerSpi'
import { type Driver as RealtimeDriver } from './RealtimeSpi'
import { type Driver as AuthDriver } from './AuthSpi'
import { type Driver as ClientDriver } from './ClientSpi'
import { type Driver as MarkdownParserDriver } from './MarkdownParserSpi'
import { type Driver as ThemeDriver } from './ThemeSpi'
import { type Driver as IconLibraryDriver } from './IconLibrarySpi'
import { type Driver as FontLibraryDriver } from './FontLibrarySpi'

export interface Drivers {
  server: (config: ServerConfig) => ServerDriver
  logger: () => LoggerDriver
  database: (config: DatabaseConfig) => DatabaseDriver
  queue: (config: QueueConfig) => QueueDriver
  mailer: (config: MailerConfig) => MailerDriver
  realtime: (config: RealtimeConfig) => RealtimeDriver
  auth: (config: AuthConfig) => AuthDriver
  markdownParser: () => MarkdownParserDriver
  theme: (config: ThemeConfig) => ThemeDriver
  idGenerator: () => IdGeneratorDriver
  schemaValidator: () => SchemaValidatorDriver
  browser: () => BrowserDriver
  ui: () => UiDriver
  client: () => ClientDriver
  templateCompiler: () => TemplateCompilerDriver
  iconLibrary: () => IconLibraryDriver
  fontLibrary: () => FontLibraryDriver
}

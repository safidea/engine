import type { Drivers } from '@adapter/spi/Drivers'
import type { Config as ServerConfig } from '@domain/services/Server'
import type { Config as DatabaseConfig } from '@domain/services/Database'
import type { Config as QueueConfig } from '@domain/services/Queue'
import type { Config as MailerConfig } from '@domain/services/Mailer'
import type { Config as AuthConfig } from '@domain/services/Auth'
import type { Config as ThemeConfig } from '@domain/services/Theme'
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
import { AuthDriver } from './AuthDriver'
import { ClientDriver } from './ClientDriver'
import { MarkdownParserDriver } from './MarkdownParserDriver'
import { ThemeDriver } from './ThemeDriver'
import { IconLibraryDriver } from './IconLibraryDriver'
import { FontLibraryDriver } from './FontLibraryDriver'
import { CodeCompilerDriver } from './CodeCompilerDriver'

export const drivers: Drivers = {
  server: (config: ServerConfig) => new ServerDriver(config),
  logger: () => new LoggerDriver(),
  database: (config: DatabaseConfig) => new DatabaseDriver(config),
  queue: (config: QueueConfig) => new QueueDriver(config),
  mailer: (config: MailerConfig) => new MailerDriver(config),
  auth: (config: AuthConfig) => new AuthDriver(config),
  markdownParser: () => new MarkdownParserDriver(),
  templateCompiler: () => new TemplateCompilerDriver(),
  codeCompiler: () => new CodeCompilerDriver(),
  schemaValidator: () => new SchemaValidatorDriver(),
  browser: () => new BrowserDriver(),
  ui: () => new UiDriver(),
  client: () => new ClientDriver(),
  idGenerator: () => new IdGeneratorDriver(),
  theme: (config: ThemeConfig) => new ThemeDriver(config),
  iconLibrary: () => new IconLibraryDriver(),
  fontLibrary: () => new FontLibraryDriver(),
}

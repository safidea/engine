import type { Drivers } from '@adapter/spi/drivers'
import type { ServerConfig } from '@domain/services/Server'
import type { DatabaseConfig } from '@domain/services/Database'
import type { QueueConfig } from '@domain/services/Queue'
import type { MailerConfig } from '@domain/services/Mailer'
import type { AuthConfig } from '@domain/services/Auth'
import type { ThemeConfig } from '@domain/services/Theme'
import type { StorageConfig } from '@domain/services/Storage'
import type { MonitorsConfig } from '@domain/services/Monitor'
import type { LoggersConfig } from '@domain/services/Logger'
import type { CodeCompilerConfig } from '@domain/services/CodeCompiler'
import type { TunnelConfig } from '@domain/services/Tunnel'

import { MonitorDriver } from './shared/MonitorDriver'
import { StorageDriver } from './shared/StorageDriver'
import { SchemaValidatorDriver } from './shared/SchemaValidatorDriver'
import { BrowserDriver } from './shared/BrowserDriver'
import { ServerDriver } from './shared/ServerDriver'
import { LoggerDriver } from './shared/LoggerDriver'
import { IdGeneratorDriver } from './shared/IdGeneratorDriver'
import { DatabaseDriver } from './shared/DatabaseDriver'
import { QueueDriver } from './shared/QueueDriver'
import { MailerDriver } from './shared/MailerDriver'
import { TemplateCompilerDriver } from './shared/TemplateCompilerDriver'
import { AuthDriver } from './shared/AuthDriver'
import { ClientDriver } from './shared/ClientDriver'
import { MarkdownParserDriver } from './shared/MarkdownParserDriver'
import { ThemeDriver } from './shared/ThemeDriver'
import { IconLibraryDriver } from './shared/IconLibraryDriver'
import { FontLibraryDriver } from './shared/FontLibraryDriver'
import { CodeCompilerDriver } from './shared/CodeCompilerDriver'
import { FileSystemDriver } from './shared/FileSystemDriver'
import { SpreadsheetLoaderDriver } from './shared/SpreadsheetLoaderDriver'
import { DocumentLoaderDriver } from './shared/DocumentLoaderDriver'
import { TunnelDriver } from './shared/TunnelDriver'
import { FetcherDriver } from './shared/FetcherDriver'

export const drivers: Drivers = {
  tunnel: (config?: TunnelConfig) => new TunnelDriver(config),
  server: (config: ServerConfig) => new ServerDriver(config),
  database: (config: DatabaseConfig) => new DatabaseDriver(config),
  queue: (config: QueueConfig) => new QueueDriver(config),
  storage: (config: StorageConfig) => new StorageDriver(config),
  mailer: (config: MailerConfig) => new MailerDriver(config),
  auth: (config: AuthConfig) => new AuthDriver(config),
  theme: (config: ThemeConfig) => new ThemeDriver(config),
  monitor: (config: MonitorsConfig) => new MonitorDriver(config),
  logger: (config: LoggersConfig) => new LoggerDriver(config),
  codeCompiler: (config: CodeCompilerConfig) => new CodeCompilerDriver(config),
  markdownParser: () => new MarkdownParserDriver(),
  templateCompiler: () => new TemplateCompilerDriver(),
  schemaValidator: () => new SchemaValidatorDriver(),
  browser: () => new BrowserDriver(),
  client: () => new ClientDriver(),
  idGenerator: () => new IdGeneratorDriver(),
  iconLibrary: () => new IconLibraryDriver(),
  fontLibrary: () => new FontLibraryDriver(),
  fileSystem: () => new FileSystemDriver(),
  fetcher: () => new FetcherDriver(),
  spreadsheetLoader: () => new SpreadsheetLoaderDriver(),
  documentLoader: () => new DocumentLoaderDriver(),
}

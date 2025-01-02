import { type IBrowserDriver } from './BrowserSpi'
import { type IDatabaseDriver } from './DatabaseSpi'
import { type IIdGeneratorDriver } from './IdGeneratorSpi'
import { type ILoggerDriver } from './LoggerSpi'
import { type ISchemaValidatorDriver } from './SchemaValidatorSpi'
import { type IServerDriver } from './ServerSpi'
import { type IQueueDriver } from './QueueSpi'
import { type IMailerDriver } from './MailerSpi'
import { type ITemplateCompilerDriver } from './TemplateCompilerSpi'
import { type ICodeCompilerDriver } from './CodeCompilerSpi'
import { type IFileSystemDriver } from './FileSystemSpi'
import { type IStorageDriver } from './StorageSpi'
import { type ISpreadsheetLoaderDriver } from './SpreadsheetLoaderSpi'
import { type IDocumentLoaderDriver } from './DocumentLoaderSpi'
import { type IMonitorDriver } from './MonitorSpi'
import { type ITunnelDriver } from './TunnelSpi'
import { type IFetcherDriver } from './FetcherSpi'

import { type ServerConfig } from '@domain/services/Server'
import { type DatabaseConfig } from '@domain/services/Database'
import { type QueueConfig } from '@domain/services/Queue'
import { type MailerConfig } from '@domain/services/Mailer'
import { type StorageConfig } from '@domain/services/Storage'
import { type MonitorsConfig } from '@domain/services/Monitor'
import { type LoggersConfig } from '@domain/services/Logger'
import { type CodeCompilerConfig } from '@domain/services/CodeCompiler'
import { type TunnelConfig } from '@domain/services/Tunnel'

export interface Drivers {
  tunnel: (config?: TunnelConfig) => ITunnelDriver
  server: (config: ServerConfig) => IServerDriver
  database: (config: DatabaseConfig) => IDatabaseDriver
  queue: (config: QueueConfig) => IQueueDriver
  storage: (config: StorageConfig) => IStorageDriver
  mailer: (config: MailerConfig) => IMailerDriver
  monitor: (config: MonitorsConfig) => IMonitorDriver
  logger: (config: LoggersConfig) => ILoggerDriver
  codeCompiler: (config: CodeCompilerConfig) => ICodeCompilerDriver
  idGenerator: () => IIdGeneratorDriver
  schemaValidator: () => ISchemaValidatorDriver
  browser: () => IBrowserDriver
  templateCompiler: () => ITemplateCompilerDriver
  fileSystem: () => IFileSystemDriver
  fetcher: () => IFetcherDriver
  spreadsheetLoader: () => ISpreadsheetLoaderDriver
  documentLoader: () => IDocumentLoaderDriver
}

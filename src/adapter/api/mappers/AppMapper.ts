import { App } from '@domain/entities/App'
import type { App as Config } from '@adapter/api/configs/App'
import type { Drivers } from '@adapter/spi/Drivers'
import { PageMapper } from './PageMapper'
import { TableMapper } from './TableMapper'
import { AutomationMapper } from './AutomationMapper'
import { ServerMapper } from './ServiceMapper/ServerMapper'
import { ClientMapper } from './ServiceMapper/ClientMapper'
import { IdGeneratorMapper } from './ServiceMapper/IdGeneratorMapper'
import { TemplateCompilerMapper } from './ServiceMapper/TemplateCompilerMapper'
import { IconLibraryMapper } from './ServiceMapper/IconLibraryMapper'
import { FontLibraryMapper } from './ServiceMapper/FontLibraryMapper'
import { LoggerMapper } from './ServiceMapper/LoggerMapper'
import { ThemeMapper } from './ServiceMapper/ThemeMapper'
import { MarkdownParserMapper } from './ServiceMapper/MarkdownParserMapper'
import { AuthMapper } from './ServiceMapper/AuthMapper'
import { MailerMapper } from './ServiceMapper/MailerMapper'
import { DatabaseMapper } from './ServiceMapper/DatabaseMapper'
import { QueueMapper } from './ServiceMapper/QueueMapper'
import { RealtimeMapper } from './ServiceMapper/RealtimeMapper'
import { SchemaValidatorMapper } from './ServiceMapper/SchemaValidatorMapper'
import { JavascriptCompilerMapper } from './ServiceMapper/JavascriptCompilerMapper'
import { BrowserMapper } from './ServiceMapper/BrowserMapper'
import { FileSystemMapper } from './ServiceMapper/FileSystemMapper'
import { StorageMapper } from './ServiceMapper/StorageMapper'
import { BucketMapper } from './BucketMapper'
import { SpreadsheetLoaderMapper } from './ServiceMapper/SpreadsheetLoaderMapper'
import { DocumentLoaderMapper } from './ServiceMapper/DocumentLoaderMapper'
import { MonitorMapper } from './ServiceMapper/MonitorMapper'

export class AppMapper {
  static toEntity = (drivers: Drivers, config: Config) => {
    const { name } = config
    const monitor = MonitorMapper.toService(drivers, config.monitor)
    const logger = LoggerMapper.toService(drivers, config.logger)
    const server = ServerMapper.toService(drivers, config.server, { logger, monitor })
    const idGenerator = IdGeneratorMapper.toService(drivers)
    const fileSystem = FileSystemMapper.toService(drivers)
    const client = ClientMapper.toService(drivers)
    const schemaValidator = SchemaValidatorMapper.toService(drivers)
    const templateCompiler = TemplateCompilerMapper.toService(drivers)
    const browser = BrowserMapper.toService(drivers)
    const iconLibrary = IconLibraryMapper.toService(drivers)
    const fontLibrary = FontLibraryMapper.toService(drivers, { server, idGenerator })
    const markdownParser = MarkdownParserMapper.toService(drivers, { client })
    const database = DatabaseMapper.toService(drivers, config.database, { logger, monitor })
    const theme = ThemeMapper.toService(drivers, config.theme, { server, fontLibrary })
    const mailer = MailerMapper.toService(drivers, config.mailer, { logger })
    const spreadsheetLoader = SpreadsheetLoaderMapper.toService(drivers, { templateCompiler })
    const documentLoader = DocumentLoaderMapper.toService(drivers, { templateCompiler })
    const auth = AuthMapper.toService(drivers, config.auth, {
      server,
      mailer,
      templateCompiler,
      logger,
      database,
      idGenerator,
    })
    const queue = QueueMapper.toService(drivers, { logger, database, monitor })
    const storage = StorageMapper.toService(drivers, { logger, database })
    const buckets = BucketMapper.toManyEntities(config.buckets, {
      server,
      storage,
      idGenerator,
      templateCompiler,
    })
    const tables = TableMapper.toManyEntities(config.tables, {
      database,
      server,
      idGenerator,
      templateCompiler,
      schemaValidator,
      monitor,
    })
    const realtime = RealtimeMapper.toService({ database, logger, idGenerator }, { tables })
    const pages = PageMapper.toManyEntities(
      config.pages,
      {
        logger,
        realtime,
        markdownParser,
        iconLibrary,
        client,
        server,
        idGenerator,
        templateCompiler,
      },
      { tables }
    )
    const javascriptCompiler = JavascriptCompilerMapper.toService(drivers, { tables })
    const automations = AutomationMapper.toManyEntities(
      config.automations,
      {
        logger,
        queue,
        realtime,
        server,
        idGenerator,
        templateCompiler,
        mailer,
        schemaValidator,
        javascriptCompiler,
        browser,
        fileSystem,
        spreadsheetLoader,
        documentLoader,
        monitor,
      },
      { tables, buckets }
    )
    return new App(
      {
        name,
      },
      {
        server,
        logger,
        database,
        queue,
        mailer,
        realtime,
        auth,
        theme,
        storage,
        monitor,
      },
      {
        tables,
        pages,
        automations,
        buckets,
      }
    )
  }
}

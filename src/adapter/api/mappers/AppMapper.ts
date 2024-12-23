import { StoppedApp } from '@domain/entities/App/Stopped'
import type { Config } from '@adapter/api/configs'
import type { Drivers } from '@adapter/spi/drivers'
import { PageMapper } from './PageMapper'
import { TableMapper } from './TableMapper'
import { AutomationMapper } from './AutomationMapper'
import { ServerMapper } from './Services/ServerMapper'
import { ClientMapper } from './Services/ClientMapper'
import { IdGeneratorMapper } from './Services/IdGeneratorMapper'
import { TemplateCompilerMapper } from './Services/TemplateCompilerMapper'
import { IconLibraryMapper } from './Services/IconLibraryMapper'
import { FontLibraryMapper } from './Services/FontLibraryMapper'
import { LoggerMapper } from './Services/LoggerMapper'
import { ThemeMapper } from './Services/ThemeMapper'
import { MarkdownParserMapper } from './Services/MarkdownParserMapper'
import { AuthMapper } from './Services/AuthMapper'
import { MailerMapper } from './Services/MailerMapper'
import { DatabaseMapper } from './Services/DatabaseMapper'
import { QueueMapper } from './Services/QueueMapper'
import { RealtimeMapper } from './Services/RealtimeMapper'
import { SchemaValidatorMapper } from './Services/SchemaValidatorMapper'
import { CodeCompilerMapper } from './Services/CodeCompilerMapper'
import { BrowserMapper } from './Services/BrowserMapper'
import { FileSystemMapper } from './Services/FileSystemMapper'
import { StorageMapper } from './Services/StorageMapper'
import { BucketMapper } from './BucketMapper'
import { SpreadsheetLoaderMapper } from './Services/SpreadsheetLoaderMapper'
import { DocumentLoaderMapper } from './Services/DocumentLoaderMapper'
import { MonitorMapper } from './Services/MonitorMapper'
import { NotionMapper } from './Integration/NotionMapper'
import type { Integrations } from '@adapter/spi/integrations'
import { PappersMapper } from './Integration/PappersMapper'
import { QontoMapper } from './Integration/QontoMapper'
import { TunnelMapper } from './Services/TunnelMapper'

export class AppMapper {
  static toEntity = (drivers: Drivers, integrations: Integrations, config: Config) => {
    const { name } = config
    const monitor = MonitorMapper.toService(drivers, config.monitors)
    const logger = LoggerMapper.toService(drivers, config.loggers)
    const tunnel = TunnelMapper.toService(drivers, config.tunnel)
    const server = ServerMapper.toService(drivers, config.server, { logger, monitor, tunnel })
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
    const notion = NotionMapper.toIntegration(
      integrations,
      { idGenerator, logger, storage, server, templateCompiler },
      config.integrations?.notion
    )
    const pappers = PappersMapper.toIntegration(integrations, config.integrations?.pappers)
    const qonto = QontoMapper.toIntegration(integrations, config.integrations?.qonto)
    const javascriptCompiler = CodeCompilerMapper.toService(
      drivers,
      { logger },
      { tables },
      { notion },
      { language: 'JavaScript' }
    )
    const typescriptCompiler = CodeCompilerMapper.toService(
      drivers,
      { logger },
      { tables },
      { notion },
      { language: 'TypeScript' }
    )
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
        typescriptCompiler,
        browser,
        fileSystem,
        spreadsheetLoader,
        documentLoader,
        monitor,
        database,
      },
      { tables, buckets },
      { notion, pappers, qonto }
    )
    return new StoppedApp(
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
        codeCompiler: typescriptCompiler,
      },
      {
        tables,
        pages,
        automations,
        buckets,
      },
      { notion }
    )
  }
}

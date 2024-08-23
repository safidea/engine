import { App } from '@domain/entities/App'
import type { App as Config } from '@adapter/api/configs/App'
import type { ReactComponents } from '@domain/entities/Component'
import type { Drivers } from '@adapter/spi/Drivers'
import { PageMapper } from './PageMapper'
import { TableMapper } from './TableMapper'
import { AutomationMapper } from './AutomationMapper'
import { ServerMapper } from './ServiceMapper/ServerMapper'
import { ReactMapper } from './ServiceMapper/ReactMapper'
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

interface Ressources {
  drivers: Drivers
  components: ReactComponents
}

export class AppMapper {
  static toEntity = (ressources: Ressources, config: Config) => {
    const { name } = config
    const { components, drivers } = ressources
    const logger = LoggerMapper.toService({ drivers })
    const server = ServerMapper.toService({ drivers, logger }, config.server ?? {})
    const react = ReactMapper.toService({ drivers })
    const idGenerator = IdGeneratorMapper.toService({ drivers })
    const fileSystem = FileSystemMapper.toService({ drivers })
    const client = ClientMapper.toService({ drivers })
    const schemaValidator = SchemaValidatorMapper.toService({ drivers })
    const templateCompiler = TemplateCompilerMapper.toService({ drivers })
    const browser = BrowserMapper.toService({ drivers })
    const iconLibrary = IconLibraryMapper.toService({ drivers })
    const fontLibrary = FontLibraryMapper.toService({ drivers, server, idGenerator })
    const markdownParser = MarkdownParserMapper.toService({ drivers, components, react })
    const database = DatabaseMapper.toService({ drivers, logger }, config.database ?? {})
    const theme = ThemeMapper.toService({ drivers, server, fontLibrary }, config.theme ?? {})
    const mailer = MailerMapper.toService({ drivers, logger }, config.mailer ?? {})
    const auth = AuthMapper.toService(
      { drivers, server, mailer, templateCompiler, logger, database },
      config.auth ?? {}
    )
    const queue = QueueMapper.toService({ drivers, logger, database })
    const realtime = RealtimeMapper.toService({ database, logger, idGenerator })
    const storage = StorageMapper.toService({ drivers, logger, server, database })
    const tables = TableMapper.toManyEntities(config.tables ?? [], {
      logger,
      database,
      server,
      idGenerator,
      templateCompiler,
      schemaValidator,
    })
    const pages = PageMapper.toManyEntities(config.pages ?? [], {
      logger,
      realtime,
      markdownParser,
      iconLibrary,
      client,
      server,
      react,
      idGenerator,
      components,
      templateCompiler,
    })
    const javascriptCompiler = JavascriptCompilerMapper.toService({ drivers, tables })
    const automations = AutomationMapper.toManyEntities(
      config.automations ?? [],
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
        storage,
      },
      { tables }
    )
    return new App({
      name,
      tables,
      pages,
      automations,
      server,
      logger,
      database,
      queue,
      mailer,
      realtime,
      auth,
      theme,
      storage,
    })
  }
}

import { App } from '@domain/entities/App'
import type { App as Config } from '@adapter/api/configs/App'
import { PageMapper } from './PageMapper'
import { TableMapper } from './TableMapper'
import { AutomationMapper } from './AutomationMapper'
import { ServerMapper } from './ServiceMapper/ServerMapper'
import { UiMapper } from './ServiceMapper/UiMapper'
import { ClientMapper } from './ServiceMapper/ClientMapper'
import { IdGeneratorMapper } from './ServiceMapper/IdGeneratorMapper'
import { TemplateCompilerMapper } from './ServiceMapper/TemplateCompilerMapper'
import { IconLibraryMapper } from './ServiceMapper/IconLibraryMapper'
import { FontLibraryMapper } from './ServiceMapper/FontLibraryMapper'
import type { ReactComponents } from '@domain/entities/Component'
import type { Drivers } from '@adapter/spi/Drivers'
import { LoggerMapper } from './ServiceMapper/LoggerMapper'
import { ThemeMapper } from './ServiceMapper/ThemeMapper'
import { MarkdownParserMapper } from './ServiceMapper/MarkdownParserMapper'
import { AuthMapper } from './ServiceMapper/AuthMapper'
import { MailerMapper } from './ServiceMapper/MailerMapper'
import { DatabaseMapper } from './ServiceMapper/DatabaseMapper'
import { QueueMapper } from './ServiceMapper/QueueMapper'
import { RealtimeMapper } from './ServiceMapper/RealtimeMapper'

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
    const ui = UiMapper.toService({ drivers })
    const client = ClientMapper.toService({ drivers })
    const idGenerator = IdGeneratorMapper.toService({ drivers })
    const templateCompiler = TemplateCompilerMapper.toService({ drivers })
    const iconLibrary = IconLibraryMapper.toService({ drivers })
    const fontLibrary = FontLibraryMapper.toService({ drivers, server, idGenerator })
    const markdownParser = MarkdownParserMapper.toService({ drivers, components, ui })
    const database = DatabaseMapper.toService({ drivers, logger }, config.database ?? {})
    const theme = ThemeMapper.toService({ drivers, server, fontLibrary }, config.theme ?? {})
    const mailer = MailerMapper.toService({ drivers, logger }, config.mailer ?? {})
    const auth = AuthMapper.toService(
      { drivers, server, mailer, templateCompiler, logger, database },
      config.auth ?? {}
    )
    const queue = QueueMapper.toService({ drivers, logger, database })
    const realtime = RealtimeMapper.toService({ database, logger, idGenerator })
    const tables = TableMapper.toManyEntities(config.tables ?? [], {
      logger,
      database,
      server,
      idGenerator,
      templateCompiler,
    })
    const pages = PageMapper.toManyEntities(config.pages ?? [], {
      logger,
      realtime,
      markdownParser,
      iconLibrary,
      client,
      server,
      ui,
      idGenerator,
      components,
      templateCompiler,
    })
    const automations = AutomationMapper.toManyEntities(config.automations ?? [], {
      logger,
      database,
      queue,
      realtime,
      server,
      idGenerator,
      templateCompiler,
      mailer,
    })
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
    })
  }
}

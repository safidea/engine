import { App } from '@domain/engine/App'
import { Services } from '@domain/services'
import type { App as AppConfig } from '../configs/App'
import type { Mapper } from './Mapper'
import { PageMapper, type Params as PageParams } from './page/PageMapper'
import { TableMapper, type Params as TableParams } from './table/TableMapper'
import { AutomationMapper, type Params as AutomationParams } from './automation/AutomationMapper'
import { SpecMapper, type Params as SpecParams } from './spec/SpecMapper'
import type { Database, Config as DatabaseConfig } from '@domain/services/Database'
import type { Server } from '@domain/services/Server'
import type { Logger } from '@domain/services/Logger'
import type { Queue } from '@domain/services/Queue'
import type { Mailer, Config as MailerConfig } from '@domain/services/Mailer'
import type { Realtime } from '@domain/services/Realtime'
import type { Auth } from '@domain/services/Auth'
import type { Theme } from '@domain/services/Theme'

export interface Params {
  spec?: SpecParams
  table?: TableParams
  page?: PageParams
  automation?: AutomationParams
  newLogger: (location: string) => Logger
  server: Server
  theme: Theme
  database?: Database
  queue?: Queue
  mailer?: Mailer
  realtime?: Realtime
  auth?: Auth
}

export const AppMapper: Mapper<AppConfig, App, Params> = class AppMapper {
  static toEntity = (config: AppConfig, params: Params) => {
    const { name } = config
    const { server, newLogger, database, queue, mailer, realtime, auth, theme } = params
    const tables = params.table ? TableMapper.toManyEntities(config.tables ?? [], params.table) : []
    const pages = params.page ? PageMapper.toManyEntities(config.pages ?? [], params.page) : []
    const automations = params.automation
      ? AutomationMapper.toManyEntities(config.automations ?? [], params.automation)
      : []
    const specs = params.spec ? SpecMapper.toManyEntities(config.specs ?? [], params.spec) : []
    const logger = newLogger(`app:${name}`)
    return new App({
      name,
      specs,
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

  static toManyEntities = (configs: AppConfig[], params: Params) => {
    return configs.map((config) => this.toEntity(config, params))
  }

  static toEntityFromServices = (config: AppConfig, services: Services) => {
    const server = services.server({
      logger: services.logger({ location: `server` }),
      port: config.server?.port,
      sslCert: config.server?.sslCert,
      sslKey: config.server?.sslKey,
      env: config.server?.env,
    })
    const ui = services.ui()
    const client = services.client()
    const components = services.components
    const record = services.record()
    const idGenerator = services.idGenerator()
    const templateCompiler = services.templateCompiler()
    const iconLibrary = services.iconLibrary()
    const fontLibrary = services.fontLibrary({
      server,
      idGenerator,
    })
    const theme = services.theme({
      fontLibrary,
      server,
      ...(config.theme ?? {}),
    })
    const markdownParser = services.markdownParser({
      components,
      ui,
    })
    const newLogger = (location: string) => services.logger({ location })
    const newBrowser = () => services.browser()
    let table: TableParams | undefined
    let page: PageParams | undefined
    let automation: AutomationParams | undefined
    let spec: SpecParams | undefined
    let queue: Queue | undefined
    let mailer: Mailer | undefined
    let auth: Auth | undefined
    const { type: databaseType, url: databaseUrl } = config.database ?? {}
    if (databaseType && databaseType !== 'sqlite' && databaseType !== 'postgres')
      throw new Error(`Database ${config.database?.type} not supported`)
    const databaseConfig: DatabaseConfig = {
      url: databaseUrl ?? ':memory:',
      type: databaseType === 'postgres' ? 'postgres' : 'sqlite',
    }
    const mailerConfig: MailerConfig = {
      host:
        config.mailer?.host ?? (databaseConfig.type === 'sqlite' ? databaseConfig.url : ':memory:'),
      port: config.mailer?.port ?? '0',
      user: config.mailer?.user ?? '_sqlite',
      pass: config.mailer?.pass ?? '_sqlite',
      from: config.mailer?.from ?? 'noreply@localhost',
    }
    const database = services.database({
      logger: services.logger({ location: `database` }),
      ...databaseConfig,
    })
    const realtime = services.realtime({
      logger: services.logger({ location: `realtime` }),
      database,
      idGenerator,
    })
    if (config.specs && config.specs.length > 0) {
      spec = { newLogger, newBrowser }
    }
    if (config.tables && config.tables.length > 0) table = { newLogger, server, database, record }
    if (config.pages && config.pages.length > 0)
      page = {
        server,
        newLogger,
        ui,
        client,
        components,
        idGenerator,
        realtime,
        templateCompiler,
        markdownParser,
        iconLibrary,
      }
    if (config.automations && config.automations.length > 0) {
      queue = services.queue({
        logger: services.logger({ location: `queue` }),
        database,
      })
      mailer = services.mailer({
        logger: services.logger({ location: `mailer` }),
        ...mailerConfig,
      })
      automation = {
        newLogger,
        server,
        queue,
        mailer,
        idGenerator,
        database,
        templateCompiler,
        realtime,
      }
    }
    if (config.auth) {
      if (!mailer) {
        mailer = services.mailer({
          logger: services.logger({ location: `mailer` }),
          ...mailerConfig,
        })
      }
      auth = services.auth({
        logger: services.logger({ location: `auth` }),
        database,
        server,
        mailer,
        templateCompiler,
        from: mailerConfig.from,
        ...config.auth,
      })
    }
    return this.toEntity(config, {
      spec,
      table,
      page,
      newLogger,
      server,
      database,
      automation,
      queue,
      mailer,
      realtime,
      auth,
      theme,
    })
  }

  static toManyEntitiesFromServices = (configs: AppConfig[], services: Services) => {
    return configs.map((config) => this.toEntityFromServices(config, services))
  }
}

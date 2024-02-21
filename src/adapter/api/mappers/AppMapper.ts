import { App } from '@domain/engine/App'
import { Services } from '@domain/services'
import type { App as AppConfig } from '../configs/App'
import type { Feature as FeatureConfig } from '../configs/Feature'
import type { Mapper } from './Mapper'
import { PageMapper, type Params as PageParams } from './page/PageMapper'
import { TableMapper, type Params as TableParams } from './table/TableMapper'
import { AutomationMapper, type Params as AutomationParams } from './automation/AutomationMapper'
import type { Database } from '@domain/services/Database'
import type { Table } from '@domain/engine/table/Table'
import type { Page } from '@domain/engine/page/Page'
import type { Server } from '@domain/services/Server'
import type { Logger } from '@domain/services/Logger'
import type { Automation } from '@domain/engine/automation/Automation'
import type { Queue } from '@domain/services/Queue'
import type { Database as DatabaseConfig } from '../configs/Database'
import type { Mailer as MailerConfig } from '../configs/Mailer'
import type { Mailer } from '@domain/services/Mailer'
import type { Realtime } from '@domain/services/Realtime'
import type { Auth } from '@domain/services/Auth'

export interface Params {
  table?: TableParams
  page?: PageParams
  automation?: AutomationParams
  newLogger: (location: string) => Logger
  server: Server
  database?: Database
  queue?: Queue
  mailer?: Mailer
  realtime?: Realtime
  auth?: Auth
}

interface Private {
  featureToEntityFromServices: (featureConfig: FeatureConfig, services: Services) => App
}

export const AppMapper: Mapper<AppConfig, App, Params> & Private = class AppMapper {
  static toEntity = (config: AppConfig, params: Params) => {
    const { name, features } = config
    const { server, newLogger, database, queue, mailer, realtime, auth } = params
    const tables: Table[] = []
    const pages: Page[] = []
    const automations: Automation[] = []
    for (const feature of features) {
      if (params.table && feature.tables && feature.tables.length > 0) {
        tables.push(...TableMapper.toManyEntities(feature.tables, params.table))
      }
      if (params.page && feature.pages && feature.pages.length > 0) {
        pages.push(...PageMapper.toManyEntities(feature.pages, params.page))
      }
      if (params.automation && feature.automations && feature.automations.length > 0) {
        automations.push(...AutomationMapper.toManyEntities(feature.automations, params.automation))
      }
    }
    const logger = newLogger(`app:${name}`)
    if (params.page && !pages.find((page) => page.path === '/404')) {
      pages.push(
        PageMapper.toEntity(
          {
            name: 'not found',
            path: '/404',
            head: {
              title: '404 not found',
            },
            body: [
              {
                component: 'NotFound',
                title: "Something's missing.",
                description:
                  "Sorry, we can't find that page. You'll find lots to explore on the home page.",
                primaryButton: {
                  label: 'Back to Homepage',
                  href: '/',
                },
              },
            ],
          },
          params.page
        )
      )
    }
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
    })
  }

  static toManyEntities = (configs: AppConfig[], params: Params) => {
    return configs.map((config) => this.toEntity(config, params))
  }

  static toEntityFromServices = (config: AppConfig, services: Services) => {
    const server = services.server({
      logger: services.logger({ location: `server` }),
      port: config.server?.port,
    })
    const ui = services.ui()
    const components = services.components
    const record = services.record()
    const idGenerator = services.idGenerator()
    const templateCompiler = services.templateCompiler()
    const newLogger = (location: string) => services.logger({ location })
    let database: Database | undefined
    let queue: Queue | undefined
    let mailer: Mailer | undefined
    let realtime: Realtime | undefined
    let auth: Auth | undefined
    let table: TableParams | undefined
    let page: PageParams | undefined
    let automation: AutomationParams | undefined
    const databaseConfig: DatabaseConfig = {
      url: config.database?.url ?? ':memory:',
      db: config.database?.db ?? 'sqlite',
    }
    const mailerConfig: MailerConfig = {
      host:
        config.mailer?.host ?? (databaseConfig.db === 'sqlite' ? databaseConfig.url : ':memory:'),
      port: config.mailer?.port ?? '0',
      user: config.mailer?.user ?? '_sqlite',
      pass: config.mailer?.pass ?? '_sqlite',
      from: config.mailer?.from ?? 'noreply@localhost',
    }
    if (config.features.some((feature) => feature.tables && feature.tables.length > 0)) {
      database = services.database({
        logger: services.logger({ location: `database` }),
        ...databaseConfig,
      })
      realtime = services.realtime({
        logger: services.logger({ location: `realtime` }),
        database,
      })
      table = { newLogger, server, database, record }
    }
    if (config.features.some((feature) => feature.pages && feature.pages.length > 0)) {
      page = { server, newLogger, ui, components, idGenerator }
    }
    if (config.features.some((feature) => feature.automations && feature.automations.length > 0)) {
      if (!database) {
        database = services.database({
          logger: services.logger({ location: `database` }),
          ...databaseConfig,
        })
      }
      if (!realtime) {
        realtime = services.realtime({
          logger: services.logger({ location: `realtime` }),
          database,
        })
      }
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
      if (!database) {
        database = services.database({
          logger: services.logger({ location: `database` }),
          ...databaseConfig,
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
    })
  }

  static featureToEntityFromServices = (featureConfig: FeatureConfig, services: Services) => {
    const appConfig: AppConfig = {
      name: 'feature: ' + featureConfig.name,
      features: [featureConfig],
      auth: featureConfig.auth,
    }
    return this.toEntityFromServices(appConfig, services)
  }

  static toManyEntitiesFromServices = (configs: AppConfig[], services: Services) => {
    return configs.map((config) => this.toEntityFromServices(config, services))
  }
}

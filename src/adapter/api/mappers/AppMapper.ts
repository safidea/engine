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
import type { Mailer } from '@domain/services/Mailer'

export interface Params {
  table?: TableParams
  page?: PageParams
  automation?: AutomationParams
  newLogger: (location: string) => Logger
  server: Server
  database?: Database
  queue?: Queue
}

interface Private {
  featureToEntityFromServices: (featureConfig: FeatureConfig, services: Services) => App
}

export const AppMapper: Mapper<AppConfig, App, Params> & Private = class AppMapper {
  static toEntity = (config: AppConfig, params: Params) => {
    const { name, features } = config
    const { server, newLogger, database, queue } = params
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
    const newLogger = (location: string) => services.logger({ location })
    let database: Database | undefined
    let queue: Queue | undefined
    let mailer: Mailer | undefined
    let table: TableParams | undefined
    let page: PageParams | undefined
    let automation: AutomationParams | undefined
    const databaseConfig: DatabaseConfig = {
      url: config.database?.url ?? ':memory:',
      db: config.database?.db ?? 'sqlite',
    }
    if (config.features.some((feature) => feature.tables && feature.tables.length > 0)) {
      database = services.database({
        logger: services.logger({ location: `database` }),
        ...databaseConfig,
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
      queue = services.queue({
        logger: services.logger({ location: `queue` }),
        ...databaseConfig,
      })
      if (config.mailer) {
        mailer = services.mailer({
          logger: services.logger({ location: `mailer` }),
          ...config.mailer,
        })
      }
      const templateCompiler = services.templateCompiler()
      automation = { newLogger, server, queue, mailer, idGenerator, database, templateCompiler }
    }
    return this.toEntity(config, { table, page, newLogger, server, database, automation, queue })
  }

  static featureToEntityFromServices = (featureConfig: FeatureConfig, services: Services) => {
    const appConfig: AppConfig = {
      name: 'feature: ' + featureConfig.name,
      features: [featureConfig],
    }
    return this.toEntityFromServices(appConfig, services)
  }

  static toManyEntitiesFromServices = (configs: AppConfig[], services: Services) => {
    return configs.map((config) => this.toEntityFromServices(config, services))
  }
}

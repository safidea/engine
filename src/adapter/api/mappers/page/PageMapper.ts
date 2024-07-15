import { Page } from '@domain/engine/page/Page'
import { Services } from '@domain/services'
import type { Page as PageConfig } from '../../configs/page/Page'
import { ComponentMapper } from './ComponentMapper'
import { HeadMapper } from './HeadMapper'
import type { BaseMapper } from '../BaseMapper'
import type { Server } from '@domain/services/Server'
import type { Logger } from '@domain/services/Logger'
import type { ReactComponents } from '@domain/engine/page/component'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Realtime } from '@domain/services/Realtime'
import type { Client } from '@domain/services/Client'
import type { Ui } from '@domain/services/Ui'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { MarkdownParser } from '@domain/services/MarkdownParser'
import type { IconLibrary } from '@domain/services/IconLibrary'

export interface Params {
  server: Server
  client: Client
  ui: Ui
  idGenerator: IdGenerator
  newLogger: (location: string) => Logger
  components: ReactComponents
  templateCompiler: TemplateCompiler
  realtime?: Realtime
  markdownParser: MarkdownParser
  iconLibrary: IconLibrary
}

export const PageMapper: BaseMapper<PageConfig, Page, Params> = class PageMapper {
  static toEntity = (config: PageConfig, params: Params): Page => {
    const { name, path } = config
    const {
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
    } = params
    const logger = newLogger(`page:${config.name}`)
    const body = ComponentMapper.toManyEntities(config.body, {
      components,
      server,
      ui,
      client,
      idGenerator,
      realtime,
      templateCompiler,
      markdownParser,
      iconLibrary,
    })
    const head = HeadMapper.toEntity(config.head ?? {}, { client })
    return new Page({ name, path, head, body, server, logger, ui, Html: components.Html })
  }

  static toManyEntities = (configs: PageConfig[], params: Params) => {
    if (!configs.find((config) => config.path === '/404')) {
      configs.push({
        name: 'not found',
        path: '/404',
        head: {
          title: '404 not found',
        },
        body: [
          {
            component: 'NotFound',
            title: { text: "Something's missing." },
            paragraph: {
              text: "Sorry, we can't find that page. You'll find lots to explore on the home page.",
            },
            button: {
              label: 'Back to Homepage',
              href: '/',
            },
          },
        ],
      })
    }
    return configs.map((config) => this.toEntity(config, params))
  }

  static toEntityFromServices = (config: PageConfig, services: Services) => {
    const ui = services.ui()
    const client = services.client()
    const server = services.server({
      logger: services.logger({ location: `server` }),
    })
    const idGenerator = services.idGenerator()
    const templateCompiler = services.templateCompiler()
    const markdownParser = services.markdownParser({
      components: services.components,
      ui,
    })
    const iconLibrary = services.iconLibrary()
    const newLogger = (location: string) => services.logger({ location })
    return this.toEntity(config, {
      server,
      newLogger,
      ui,
      client,
      components: services.components,
      idGenerator,
      templateCompiler,
      markdownParser,
      iconLibrary,
    })
  }

  static toManyEntitiesFromServices = (configs: PageConfig[], services: Services) => {
    return configs.map((config) => this.toEntityFromServices(config, services))
  }
}

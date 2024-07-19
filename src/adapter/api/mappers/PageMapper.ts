import { Page } from '@domain/entities/Page'
import type { Page as Config } from '@adapter/api/configs/Page'
import { ComponentMapper } from './ComponentMapper'
import { HeadMapper } from './HeadMapper'
import type { Server } from '@domain/services/Server'
import type { Logger } from '@domain/services/Logger'
import type { ReactComponents } from '@domain/entities/Component'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Realtime } from '@domain/services/Realtime'
import type { Client } from '@domain/services/Client'
import type { Ui } from '@domain/services/Ui'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { MarkdownParser } from '@domain/services/MarkdownParser'
import type { IconLibrary } from '@domain/services/IconLibrary'

export interface Services {
  server: Server
  client: Client
  ui: Ui
  idGenerator: IdGenerator
  logger: Logger
  components: ReactComponents
  templateCompiler: TemplateCompiler
  realtime: Realtime
  markdownParser: MarkdownParser
  iconLibrary: IconLibrary
}

export class PageMapper {
  static toEntity = (config: Config, services: Services): Page => {
    const { name, path } = config
    const {
      server,
      logger,
      ui,
      client,
      components,
      idGenerator,
      realtime,
      templateCompiler,
      markdownParser,
      iconLibrary,
    } = services
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

  static toManyEntities = (configs: Config[], services: Services) => {
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
    return configs.map((config) => this.toEntity(config, services))
  }
}

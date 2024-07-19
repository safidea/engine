import { List } from '@domain/entities/Component/application/List'
import type { Config } from '@adapter/api/configs/Component/application/List'
import type { IconLibrary } from '@domain/services/IconLibrary'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Ui } from '@domain/services/Ui'
import type { Server } from '@domain/services/Server'
import type { Client } from '@domain/services/Client'
import type { ReactComponents } from '@domain/entities/Component'
import type { Realtime } from '@domain/services/Realtime'

interface Services {
  components: ReactComponents
  iconLibrary: IconLibrary
  client: Client
  server: Server
  ui: Ui
  templateCompiler: TemplateCompiler
  idGenerator: IdGenerator
  realtime: Realtime
}

export class ListMapper {
  static toEntity = (config: Config, services: Services): List => {
    const { server, ui, client, idGenerator, realtime, components, templateCompiler } = services
    return new List({
      ...config,
      Component: components.List,
      server,
      ui,
      client,
      idGenerator,
      realtime,
      templateCompiler,
    })
  }
}

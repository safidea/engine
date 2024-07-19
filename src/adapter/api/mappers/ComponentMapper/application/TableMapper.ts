import { Table } from '@domain/entities/Component/application/Table'
import type { Config } from '@adapter/api/configs/Component/application/Table'
import { TitleMapper } from '../content/TitleMapper'
import { ButtonMapper } from '../base/ButtonMapper'
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

export class TableMapper {
  static toEntity = (config: Config, services: Services): Table => {
    const { server, ui, client, idGenerator, realtime, components } = services
    const title = config.title ? TitleMapper.toEntity(config.title, services) : undefined
    const buttons = config.buttons
      ? ButtonMapper.toManyEntities(config.buttons, services)
      : undefined
    return new Table({
      ...config,
      title,
      buttons,
      Component: components.Table,
      server,
      ui,
      client,
      idGenerator,
      realtime,
    })
  }
}

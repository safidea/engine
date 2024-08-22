import { Header } from '@domain/entities/Component/marketing/Header'
import type { Config } from '@adapter/api/configs/Component/marketing/Header'
import { TitleMapper } from '../content/TitleMapper'
import type { ReactComponents } from '@domain/entities/Component'
import type { IconLibrary } from '@domain/services/IconLibrary'
import { LinkMapper } from '../content/LinkMapper'
import { DropdownMapper } from '../base/DropdownMapper'
import { ButtonMapper } from '../base/ButtonMapper'
import type { Client } from '@domain/services/Client'
import type { Server } from '@domain/services/Server'
import type { React } from '@domain/services/React'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Services {
  components: ReactComponents
  iconLibrary: IconLibrary
  client: Client
  server: Server
  react: React
  templateCompiler: TemplateCompiler
  idGenerator: IdGenerator
}

export class HeaderMapper {
  static toEntity = (config: Config, services: Services): Header => {
    const { components } = services
    const title = TitleMapper.toEntity(config.title, services)
    const links = config.links.map((link) =>
      'links' in link
        ? DropdownMapper.toEntity(link, services)
        : LinkMapper.toEntity(link, services)
    )
    const buttons = ButtonMapper.toManyEntities(config.buttons, services)
    return new Header({ ...config, title, links, buttons, Component: components.Header })
  }
}

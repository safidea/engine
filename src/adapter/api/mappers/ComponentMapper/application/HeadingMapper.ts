import { Heading } from '@domain/entities/Component/application/Heading'
import { ButtonMapper } from '../base/ButtonMapper'
import { TitleMapper } from '../content/TitleMapper'
import type { Config } from '@adapter/api/configs/Component/application/Heading'
import type { IconLibrary } from '@domain/services/IconLibrary'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { React } from '@domain/services/React'
import type { Server } from '@domain/services/Server'
import type { Client } from '@domain/services/Client'
import type { ReactComponents } from '@domain/entities/Component'

interface Services {
  components: ReactComponents
  iconLibrary: IconLibrary
  client: Client
  server: Server
  react: React
  templateCompiler: TemplateCompiler
  idGenerator: IdGenerator
}

export class HeadingMapper {
  static toEntity = (config: Config, services: Services): Heading => {
    const { components } = services
    const title = TitleMapper.toEntity(config.title, services)
    const buttons = config.buttons
      ? ButtonMapper.toManyEntities(config.buttons, services)
      : undefined
    return new Heading({ ...config, title, buttons, Component: components.Heading })
  }
}

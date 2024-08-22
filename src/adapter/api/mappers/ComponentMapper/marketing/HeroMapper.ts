import { Hero } from '@domain/entities/Component/marketing/Hero'
import type { Config } from '@adapter/api/configs/Component/marketing/Hero'
import { TitleMapper } from '../content/TitleMapper'
import type { ReactComponents } from '@domain/entities/Component'
import type { IconLibrary } from '@domain/services/IconLibrary'
import { ButtonMapper } from '../base/ButtonMapper'
import type { Client } from '@domain/services/Client'
import type { Server } from '@domain/services/Server'
import type { React } from '@domain/services/React'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import { ParagraphMapper } from '../content/ParagraphMapper'

interface Services {
  components: ReactComponents
  iconLibrary: IconLibrary
  client: Client
  server: Server
  react: React
  templateCompiler: TemplateCompiler
  idGenerator: IdGenerator
}

export class HeroMapper {
  static toEntity = (config: Config, services: Services): Hero => {
    const { components } = services
    const title = TitleMapper.toEntity(config.title, services)
    const paragraph = ParagraphMapper.toEntity(config.paragraph, services)
    const buttons = ButtonMapper.toManyEntities(config.buttons, services)
    return new Hero({ ...config, title, paragraph, buttons, Component: components.Hero })
  }
}

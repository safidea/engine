import { NotFound } from '@domain/entities/Component/marketing/NotFound'
import type { Config } from '@adapter/api/configs/Component/marketing/NotFound'
import { TitleMapper } from '../content/TitleMapper'
import type { ReactComponents } from '@domain/entities/Component'
import { ParagraphMapper } from '../content/ParagraphMapper'
import { ButtonMapper } from '../base/ButtonMapper'
import type { IconLibrary } from '@domain/services/IconLibrary'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { React } from '@domain/services/React'
import type { Server } from '@domain/services/Server'
import type { Client } from '@domain/services/Client'

interface Services {
  components: ReactComponents
  iconLibrary: IconLibrary
  client: Client
  server: Server
  react: React
  templateCompiler: TemplateCompiler
  idGenerator: IdGenerator
}

export class NotFoundMapper {
  static toEntity = (config: Config, services: Services): NotFound => {
    const { components } = services
    const title = TitleMapper.toEntity(config.title, services)
    const paragraph = ParagraphMapper.toEntity(config.paragraph, services)
    const button = ButtonMapper.toEntity(config.button, services)
    return new NotFound({ ...config, title, paragraph, button, Component: components.NotFound })
  }
}

import { Cta } from '@domain/entities/Component/marketing/Cta'
import type { Config } from '@adapter/api/configs/Component/marketing/Cta'
import { TitleMapper } from '../content/TitleMapper'
import { ParagraphMapper } from '../content/ParagraphMapper'
import { ButtonMapper } from '../base/ButtonMapper'
import type { ReactComponents } from '@domain/entities/Component'
import type { Client } from '@domain/services/Client'
import type { Ui } from '@domain/services/Ui'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Server } from '@domain/services/Server'
import type { IdGenerator } from '@domain/services/IdGenerator'

interface Services {
  components: ReactComponents
  client: Client
  ui: Ui
  templateCompiler: TemplateCompiler
  server: Server
  idGenerator: IdGenerator
}

export class CtaMapper {
  static toEntity = (config: Config, services: Services): Cta => {
    const { components } = services
    const title = TitleMapper.toEntity(config.title, services)
    const paragraph = ParagraphMapper.toEntity(config.paragraph, services)
    const buttons = ButtonMapper.toManyEntities(config.buttons, services)
    return new Cta({ ...config, title, paragraph, buttons, Component: components.Cta })
  }
}

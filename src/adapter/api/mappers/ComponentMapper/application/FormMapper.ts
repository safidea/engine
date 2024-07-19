import { Form } from '@domain/entities/Component/application/Form'
import { ButtonMapper } from '../base/ButtonMapper'
import { InputMapper } from '../base/InputMapper'
import { ParagraphMapper } from '../content/ParagraphMapper'
import { TitleMapper } from '../content/TitleMapper'
import type { Config } from '@adapter/api/configs/Component/application/Form'
import type { IconLibrary } from '@domain/services/IconLibrary'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Ui } from '@domain/services/Ui'
import type { Server } from '@domain/services/Server'
import type { Client } from '@domain/services/Client'
import type { ReactComponents } from '@domain/entities/Component'

interface Services {
  components: ReactComponents
  iconLibrary: IconLibrary
  client: Client
  server: Server
  ui: Ui
  templateCompiler: TemplateCompiler
  idGenerator: IdGenerator
}

export class FormMapper {
  static toEntity = (config: Config, params: Services): Form => {
    const { components, server, ui, client, idGenerator, templateCompiler } = params
    const title = config.title ? TitleMapper.toEntity(config.title, params) : undefined
    const paragraph = config.paragraph
      ? ParagraphMapper.toEntity(config.paragraph, params)
      : undefined
    const inputs = InputMapper.toManyEntities(config.inputs, params)
    const buttons = ButtonMapper.toManyEntities(config.buttons, params)
    return new Form({
      ...config,
      title,
      paragraph,
      inputs,
      buttons,
      Component: components.Form,
      server,
      ui,
      idGenerator,
      client,
      templateCompiler,
    })
  }
}

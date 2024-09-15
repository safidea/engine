import { Form, type Services } from '@domain/entities/Component/application/Form'
import { ButtonMapper } from '../base/ButtonMapper'
import { InputMapper } from '../base/InputMapper'
import { ParagraphMapper } from '../content/ParagraphMapper'
import { TitleMapper } from '../content/TitleMapper'
import type { Config } from '@adapter/api/configs/Component/application/Form'

export class FormMapper {
  static toEntity = (config: Config, services: Services): Form => {
    const title = config.title ? TitleMapper.toEntity(config.title, services) : undefined
    const paragraph = config.paragraph
      ? ParagraphMapper.toEntity(config.paragraph, services)
      : undefined
    const inputs = InputMapper.toManyEntities(config.inputs, services)
    const buttons = ButtonMapper.toManyEntities(config.buttons, services)
    return new Form(config, services, {
      title,
      paragraph,
      inputs,
      buttons,
    })
  }
}

import { NotFound, type Services } from '@domain/entities/Component/marketing/NotFound'
import type { Config } from '@adapter/api/configs/Component/marketing/NotFound'
import { TitleMapper } from '../content/TitleMapper'
import { ParagraphMapper } from '../content/ParagraphMapper'
import { ButtonMapper, type ButtonServices } from '../base/ButtonMapper'

export type NotFoundServices = Services & ButtonServices

export class NotFoundMapper {
  static toEntity = (config: Config, services: NotFoundServices): NotFound => {
    const title = TitleMapper.toEntity(config.title, services)
    const paragraph = ParagraphMapper.toEntity(config.paragraph, services)
    const button = ButtonMapper.toEntity(config.button, services)
    return new NotFound(config, services, { title, paragraph, button })
  }
}

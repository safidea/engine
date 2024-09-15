import { Cta, type Services } from '@domain/entities/Component/marketing/Cta'
import type { Config } from '@adapter/api/configs/Component/marketing/Cta'
import { TitleMapper } from '../content/TitleMapper'
import { ParagraphMapper } from '../content/ParagraphMapper'
import { ButtonMapper, type ButtonServices } from '../base/ButtonMapper'

export type CtaServices = Services & ButtonServices

export class CtaMapper {
  static toEntity = (config: Config, services: CtaServices): Cta => {
    const title = TitleMapper.toEntity(config.title, services)
    const paragraph = ParagraphMapper.toEntity(config.paragraph, services)
    const buttons = ButtonMapper.toManyEntities(config.buttons, services)
    return new Cta(config, services, { title, paragraph, buttons })
  }
}

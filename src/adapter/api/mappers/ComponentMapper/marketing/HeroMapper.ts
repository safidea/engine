import { Hero, type Services } from '@domain/entities/Component/marketing/Hero'
import type { Config } from '@adapter/api/configs/Component/marketing/Hero'
import { TitleMapper } from '../content/TitleMapper'
import { ButtonMapper, type ButtonServices } from '../base/ButtonMapper'
import { ParagraphMapper } from '../content/ParagraphMapper'

export type HeroServices = Services & ButtonServices

export class HeroMapper {
  static toEntity = (config: Config, services: HeroServices): Hero => {
    const title = TitleMapper.toEntity(config.title, services)
    const paragraph = ParagraphMapper.toEntity(config.paragraph, services)
    const buttons = ButtonMapper.toManyEntities(config.buttons, services)
    return new Hero(config, services, { title, paragraph, buttons })
  }
}

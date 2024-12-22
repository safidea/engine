import { Footer, type Services } from '@domain/entities/Component/marketing/Footer'
import type { Config } from '@adapter/api/configs/Component/marketing/Footer'
import { TitleMapper } from '../content/TitleMapper'
import { ParagraphMapper } from '../content/ParagraphMapper'
import { LinkMapper, type LinkServices } from '../content/LinkMapper'

export type FooterServices = Services & LinkServices

export class FooterMapper {
  static toEntity = (config: Config, services: FooterServices): Footer => {
    const title = TitleMapper.toEntity(config.title, services)
    const paragraph = ParagraphMapper.toEntity(config.paragraph, services)
    const links = LinkMapper.toManyEntities(config.links, services)
    return new Footer(config, services, { title, paragraph, links })
  }
}

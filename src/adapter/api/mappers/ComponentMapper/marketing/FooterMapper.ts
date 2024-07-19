import { Footer } from '@domain/entities/Component/marketing/Footer'
import type { Config } from '@adapter/api/configs/Component/marketing/Footer'
import { TitleMapper } from '../content/TitleMapper'
import { ParagraphMapper } from '../content/ParagraphMapper'
import type { ReactComponents } from '@domain/entities/Component'
import type { IconLibrary } from '@domain/services/IconLibrary'
import { LinkMapper } from '../content/LinkMapper'

interface Services {
  components: ReactComponents
  iconLibrary: IconLibrary
}

export class FooterMapper {
  static toEntity = (config: Config, services: Services): Footer => {
    const { components } = services
    const title = TitleMapper.toEntity(config.title, services)
    const paragraph = ParagraphMapper.toEntity(config.paragraph, services)
    const links = LinkMapper.toManyEntities(config.links, services)
    return new Footer({ ...config, title, paragraph, links, Component: components.Footer })
  }
}

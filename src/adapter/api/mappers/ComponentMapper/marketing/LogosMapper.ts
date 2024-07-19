import { Logos } from '@domain/entities/Component/marketing/Logos'
import type { Config } from '@adapter/api/configs/Component/marketing/Logos'
import { TitleMapper } from '../content/TitleMapper'
import type { ReactComponents } from '@domain/entities/Component'
import { ParagraphMapper } from '../content/ParagraphMapper'
import { ImageMapper } from '../content/ImageMapper'

interface Services {
  components: ReactComponents
}

export class LogosMapper {
  static toEntity = (config: Config, services: Services): Logos => {
    const { components } = services
    const title = config.title ? TitleMapper.toEntity(config.title, services) : undefined
    const paragraph = config.paragraph
      ? ParagraphMapper.toEntity(config.paragraph, services)
      : undefined
    const images = ImageMapper.toManyEntities(config.images, services)
    return new Logos({ ...config, title, paragraph, images, Component: components.Logos })
  }
}

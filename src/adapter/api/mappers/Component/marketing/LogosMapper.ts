import { Logos, type Services } from '@domain/entities/Component/marketing/Logos'
import type { Config } from '@adapter/api/configs/Component/marketing/Logos'
import { TitleMapper } from '../content/TitleMapper'
import { ParagraphMapper } from '../content/ParagraphMapper'
import { ImageMapper } from '../content/ImageMapper'

export class LogosMapper {
  static toEntity = (config: Config, services: Services): Logos => {
    const title = config.title ? TitleMapper.toEntity(config.title, services) : undefined
    const paragraph = config.paragraph
      ? ParagraphMapper.toEntity(config.paragraph, services)
      : undefined
    const images = ImageMapper.toManyEntities(config.images, services)
    return new Logos(config, services, { title, paragraph, images })
  }
}

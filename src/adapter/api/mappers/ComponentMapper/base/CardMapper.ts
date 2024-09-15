import { Card, type Services } from '@domain/entities/Component/base/Card'
import { ImageMapper } from '../content/ImageMapper'
import { ParagraphMapper } from '../content/ParagraphMapper'
import { TitleMapper } from '../content/TitleMapper'
import type { Config } from '@adapter/api/configs/Component/base/Card'

export class CardMapper {
  static toEntity = (config: Config, services: Services): Card => {
    const image = config.image ? ImageMapper.toEntity(config.image, services) : undefined
    const title = TitleMapper.toEntity(config.title, services)
    const paragraph = ParagraphMapper.toEntity(config.paragraph, services)
    return new Card(config, services, { image, title, paragraph })
  }
}

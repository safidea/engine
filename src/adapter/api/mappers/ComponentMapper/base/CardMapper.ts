import { Card } from '@domain/entities/Component/base/Card'
import { ImageMapper } from '../content/ImageMapper'
import { ParagraphMapper } from '../content/ParagraphMapper'
import { TitleMapper } from '../content/TitleMapper'
import type { ReactComponents } from '@domain/entities/Component'
import type { Config } from '@adapter/api/configs/Component/base/Card'

interface Services {
  components: ReactComponents
}

export class CardMapper {
  static toEntity = (config: Config, services: Services): Card => {
    const { components } = services
    const image = config.image ? ImageMapper.toEntity(config.image, services) : undefined
    const title = TitleMapper.toEntity(config.title, services)
    const paragraph = ParagraphMapper.toEntity(config.paragraph, services)
    return new Card({ ...config, image, title, paragraph, Component: components.Card })
  }
}

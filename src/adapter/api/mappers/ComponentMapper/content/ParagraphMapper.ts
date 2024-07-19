import { Paragraph } from '@domain/entities/Component/content/Paragraph'
import type { ReactComponents } from '@domain/entities/Component'
import type { Config } from '@adapter/api/configs/Component/content/Paragraph'

interface Services {
  components: ReactComponents
}

export class ParagraphMapper {
  static toEntity = (config: Config, services: Services): Paragraph => {
    const { components } = services
    return new Paragraph({ ...config, Component: components.Paragraph })
  }
}

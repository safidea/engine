import { Features } from '@domain/entities/Component/marketing/Features'
import type { Config } from '@adapter/api/configs/Component/marketing/Features'
import { TitleMapper } from '../content/TitleMapper'
import { ParagraphMapper } from '../content/ParagraphMapper'
import { IconMapper } from '../content/IconMapper'
import type { ReactComponents } from '@domain/entities/Component'
import type { IconLibrary } from '@domain/services/IconLibrary'

interface Services {
  components: ReactComponents
  iconLibrary: IconLibrary
}

export class FeaturesMapper {
  static toEntity = (config: Config, services: Services): Features => {
    const { components } = services
    const title = TitleMapper.toEntity(config.title, services)
    const paragraph = ParagraphMapper.toEntity(config.paragraph, services)
    const features = config.features.map((feature) => {
      return {
        title: TitleMapper.toEntity(feature.title, services),
        paragraph: ParagraphMapper.toEntity(feature.paragraph, services),
        icon: IconMapper.toEntity(feature.icon, services),
      }
    })
    return new Features({
      ...config,
      title,
      paragraph,
      features,
      Component: components.Features,
    })
  }
}

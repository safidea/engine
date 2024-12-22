import { Features, type Services } from '@domain/entities/Component/marketing/Features'
import type { Config } from '@adapter/api/configs/Component/marketing/Features'
import { TitleMapper } from '../content/TitleMapper'
import { ParagraphMapper } from '../content/ParagraphMapper'
import { IconMapper, type IconServices } from '../content/IconMapper'

export type FeaturesServices = Services & IconServices

export class FeaturesMapper {
  static toEntity = (config: Config, services: FeaturesServices): Features => {
    const title = TitleMapper.toEntity(config.title, services)
    const paragraph = ParagraphMapper.toEntity(config.paragraph, services)
    const features = config.features.map((feature) => {
      return {
        title: TitleMapper.toEntity(feature.title, services),
        paragraph: ParagraphMapper.toEntity(feature.paragraph, services),
        icon: IconMapper.toEntity(feature.icon, services),
      }
    })
    return new Features(config, services, { title, paragraph, features })
  }
}

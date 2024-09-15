import type { Config } from '@adapter/api/configs/Component/content/Image'
import { Image, type Services } from '@domain/entities/Component/content/Image'

export class ImageMapper {
  static toEntity = (config: Config, services: Services): Image => {
    return new Image(config, services)
  }

  static toManyEntities = (configs: Config[], services: Services): Image[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}

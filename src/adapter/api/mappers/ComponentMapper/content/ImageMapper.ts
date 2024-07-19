import type { Config } from '@adapter/api/configs/Component/content/Image'
import type { ReactComponents } from '@domain/entities/Component'
import { Image } from '@domain/entities/Component/content/Image'

interface Services {
  components: ReactComponents
}

export class ImageMapper {
  static toEntity = (config: Config, services: Services): Image => {
    const { components } = services
    return new Image({ ...config, Component: components.Image })
  }

  static toManyEntities = (configs: Config[], services: Services): Image[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}

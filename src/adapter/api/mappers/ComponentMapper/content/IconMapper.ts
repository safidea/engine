import { Icon, type Services } from '@domain/entities/Component/content/Icon'
import type { Config } from '@adapter/api/configs/Component/content/Icon'

export type IconServices = Services

export class IconMapper {
  static toEntity = (config: Config, services: Services): Icon => {
    return new Icon(config, services)
  }
}

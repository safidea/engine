import { Link } from '@domain/entities/Component/content/Link'
import type { Config } from '@adapter/api/configs/Component/content/Link'
import type { ReactComponents } from '@domain/entities/Component'
import { IconMapper } from './IconMapper'
import type { IconLibrary } from '@domain/services/IconLibrary'

interface Services {
  components: ReactComponents
  iconLibrary: IconLibrary
}

export class LinkMapper {
  static toEntity = (config: Config, services: Services): Link => {
    const { components } = services
    const prefixIcon = config.prefixIcon
      ? IconMapper.toEntity(config.prefixIcon, services)
      : undefined
    const suffixIcon = config.suffixIcon
      ? IconMapper.toEntity(config.suffixIcon, services)
      : undefined
    return new Link({ ...config, prefixIcon, suffixIcon, Component: components.Link })
  }

  static toManyEntities = (configs: Config[], services: Services): Link[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}

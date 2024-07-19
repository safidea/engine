import { Dropdown } from '@domain/entities/Component/base/Dropdown'
import { LinkMapper } from '../content/LinkMapper'
import type { ReactComponents } from '@domain/entities/Component'
import type { Config } from '@adapter/api/configs/Component/base/Dropdown'
import type { IconLibrary } from '@domain/services/IconLibrary'

interface Services {
  components: ReactComponents
  iconLibrary: IconLibrary
}

export class DropdownMapper {
  static toEntity = (config: Config, services: Services): Dropdown => {
    const { components } = services
    const links = LinkMapper.toManyEntities(config.links, services)
    return new Dropdown({ ...config, links, Component: components.Dropdown })
  }
}

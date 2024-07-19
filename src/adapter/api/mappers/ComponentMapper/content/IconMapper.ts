import type { ReactComponents } from '@domain/entities/Component'
import { Icon } from '@domain/entities/Component/content/Icon'
import { IconLibrary } from '@domain/services/IconLibrary'
import type { Config } from '@adapter/api/configs/Component/content/Icon'

interface Services {
  components: ReactComponents
  iconLibrary: IconLibrary
}

export class IconMapper {
  static toEntity = (config: Config, services: Services): Icon => {
    const { iconLibrary, components } = services
    return new Icon({ ...config, iconLibrary, Component: components.Icon })
  }
}

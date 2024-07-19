import type { ReactComponents } from '@domain/entities/Component'
import { Title } from '@domain/entities/Component/content/Title'
import type { Config } from '@adapter/api/configs/Component/content/Title'

interface Services {
  components: ReactComponents
}

export class TitleMapper {
  static toEntity = (config: Config, services: Services): Title => {
    const { components } = services
    return new Title({ ...config, Component: components.Title })
  }
}

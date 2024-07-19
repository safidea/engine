import type { ReactComponents } from '@domain/entities/Component'
import { Divider } from '@domain/entities/Component/content/Divider'
import type { Config } from '@adapter/api/configs/Component/content/Divider'

interface Services {
  components: ReactComponents
}

export class DividerMapper {
  static toEntity = (config: Config, services: Services): Divider => {
    const { components } = services
    return new Divider({ ...config, Component: components.Divider })
  }
}

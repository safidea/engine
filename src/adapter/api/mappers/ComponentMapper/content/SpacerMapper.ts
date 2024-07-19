import { Spacer } from '@domain/entities/Component/content/Spacer'
import type { Config } from '@adapter/api/configs/Component/content/Spacer'
import type { ReactComponents } from '@domain/entities/Component'

interface Services {
  components: ReactComponents
}

export class SpacerMapper {
  static toEntity = (config: Config, services: Services): Spacer => {
    const { components } = services
    return new Spacer({ ...config, Component: components.Spacer })
  }
}

import type { ReactComponents } from '@domain/entities/Component'
import { Input } from '@domain/entities/Component/base/Input'
import type { Config } from '@adapter/api/configs/Component/base/Input'

interface Services {
  components: ReactComponents
}

export class InputMapper {
  static toEntity = (config: Config, services: Services): Input => {
    const { components } = services
    return new Input({ ...config, Component: components.Input })
  }

  static toManyEntities = (configs: Config[], services: Services): Input[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}

import { Input, type Services } from '@domain/entities/Component/base/Input'
import type { Config } from '@adapter/api/configs/Component/base/Input'

export class InputMapper {
  static toEntity = (config: Config, services: Services): Input => {
    return new Input(config, services)
  }

  static toManyEntities = (configs: Config[], services: Services): Input[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}

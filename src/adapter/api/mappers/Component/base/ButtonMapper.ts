import { Button, type Services } from '@domain/entities/Component/base/Button'
import type { Config } from '@adapter/api/configs/Component/base/Button'

export type ButtonServices = Services

export class ButtonMapper {
  static toEntity = (config: Config, services: Services): Button => {
    return new Button(config, services)
  }

  static toManyEntities = (configs: Config[], services: Services): Button[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}

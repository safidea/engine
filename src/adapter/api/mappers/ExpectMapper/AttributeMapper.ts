import type { Attribute as Config } from '@adapter/api/configs/Expect/Attribute'
import { Attribute, type Services } from '@domain/entities/Expect/Attribute'

export class AttributeMapper {
  static toEntity = (config: Config, services: Services): Attribute => {
    return new Attribute(config, services)
  }
}

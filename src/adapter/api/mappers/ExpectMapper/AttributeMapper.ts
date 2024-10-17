import type { Attribute as Config } from '@adapter/api/configs/Expect/Attribute'
import { Attribute } from '@domain/entities/Expect/Attribute'

export class AttributeMapper {
  static toEntity = (config: Config): Attribute => {
    return new Attribute(config)
  }
}

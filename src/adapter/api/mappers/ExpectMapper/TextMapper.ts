import type { Text as Config } from '@adapter/api/configs/Expect/Text'
import { Text, type Services } from '@domain/entities/Expect/Text'

export class TextMapper {
  static toEntity = (config: Config, services: Services): Text => {
    return new Text(config, services)
  }
}

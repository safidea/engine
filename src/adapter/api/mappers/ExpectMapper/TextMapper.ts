import type { Text as Config } from '@adapter/api/configs/Expect/Text'
import { Text } from '@domain/entities/Expect/Text'

export class TextMapper {
  static toEntity = (config: Config): Text => {
    return new Text(config)
  }
}

import type { Title as Config } from '@adapter/api/configs/Expect/Title'
import { Title } from '@domain/entities/Expect/Title'

export class TitleMapper {
  static toEntity = (config: Config): Title => {
    return new Title(config)
  }
}

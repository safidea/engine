import type { Title as Config } from '@adapter/api/configs/Expect/Title'
import { Title, type Services } from '@domain/entities/Expect/Title'

export class TitleMapper {
  static toEntity = (config: Config, services: Services): Title => {
    return new Title(config, services)
  }
}

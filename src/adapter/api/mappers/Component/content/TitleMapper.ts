import { Title, type Services } from '@domain/entities/Component/content/Title'
import type { Config } from '@adapter/api/configs/Component/content/Title'

export class TitleMapper {
  static toEntity = (config: Config, services: Services): Title => {
    return new Title(config, services)
  }
}

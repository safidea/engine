import { Divider, type Services } from '@domain/entities/Component/content/Divider'
import type { Config } from '@adapter/api/configs/Component/content/Divider'

export class DividerMapper {
  static toEntity = (config: Config, services: Services): Divider => {
    return new Divider(config, services)
  }
}

import { Spacer, type Services } from '@domain/entities/Component/content/Spacer'
import type { Config } from '@adapter/api/configs/Component/content/Spacer'

export class SpacerMapper {
  static toEntity = (config: Config, services: Services): Spacer => {
    return new Spacer(config, services)
  }
}

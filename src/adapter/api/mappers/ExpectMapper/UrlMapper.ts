import type { Url as Config } from '@adapter/api/configs/Expect/Url'
import { Url, type Services } from '@domain/entities/Expect/Url'

export class UrlMapper {
  static toEntity = (config: Config, services: Services): Url => {
    return new Url(config, services)
  }
}

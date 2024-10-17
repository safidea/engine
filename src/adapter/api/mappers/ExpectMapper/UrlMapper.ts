import type { Url as Config } from '@adapter/api/configs/Expect/Url'
import { Url } from '@domain/entities/Expect/Url'

export class UrlMapper {
  static toEntity = (config: Config): Url => {
    return new Url(config)
  }
}

import type { Equal as Config } from '@adapter/api/configs/Expect/Equal'
import { Equal, type Services } from '@domain/entities/Expect/Equal'

export class EqualMapper {
  static toEntity = (config: Config, services: Services): Equal => {
    return new Equal(config, services)
  }
}

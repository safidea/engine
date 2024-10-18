import type { Exist as Config } from '@adapter/api/configs/Expect/Exist'
import { Exist, type Services } from '@domain/entities/Expect/Exist'

export class ExistMapper {
  static toEntity = (config: Config, services: Services): Exist => {
    return new Exist(config, services)
  }
}

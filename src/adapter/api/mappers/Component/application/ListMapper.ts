import { List, type Services } from '@domain/entities/Component/application/List'
import type { Config } from '@adapter/api/configs/Component/application/List'

export class ListMapper {
  static toEntity = (config: Config, services: Services): List => {
    return new List(config, services)
  }
}

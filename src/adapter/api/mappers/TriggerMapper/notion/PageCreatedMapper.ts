import {
  PageCreated,
  type Config,
  type Services,
} from '@domain/entities/Trigger/notion/PageCreated'

export class PageCreatedMapper {
  static toEntity = (config: Config, services: Services): PageCreated => {
    return new PageCreated(config, services)
  }

  static toManyEntities = (configs: Config[], services: Services): PageCreated[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
